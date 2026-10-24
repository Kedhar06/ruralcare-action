const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/server');
const seed = require('../src/db/seed');

let patientToken = '';
let workerToken = '';

test.before(async () => {
  seed();

  const patientLogin = await request(app)
    .post('/api/auth/login')
    .send({ identifier: '9876543210', password: 'Password@123' });
  patientToken = patientLogin.body.token;

  const workerLogin = await request(app)
    .post('/api/auth/login')
    .send({ identifier: '9876543220', password: 'Password@123' });
  workerToken = workerLogin.body.token;
});

test('POST /api/appointments - patient can book an appointment', async () => {
  const res = await request(app)
    .post('/api/appointments')
    .set('Authorization', `Bearer ${patientToken}`)
    .send({
      facility_id: 1,
      appointment_date: '2026-11-10',
      time_slot: 'morning',
      reason: 'General health checkup and hypertension review',
      priority: 'routine',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.appointment.token_number.startsWith('OPD-KD-'));
  assert.strictEqual(res.body.appointment.status, 'pending');
});

test('GET /api/appointments - patient can only list their own appointments', async () => {
  const res = await request(app)
    .get('/api/appointments')
    .set('Authorization', `Bearer ${patientToken}`);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.appointments.length > 0);
  for (const appt of res.body.appointments) {
    assert.strictEqual(appt.patient_id, 1);
  }
});

test('PATCH /api/appointments/:id/status - health worker can confirm appointment', async () => {
  const listRes = await request(app)
    .get('/api/appointments')
    .set('Authorization', `Bearer ${workerToken}`);
  const targetAppt = listRes.body.appointments[0];

  const res = await request(app)
    .patch(`/api/appointments/${targetAppt.id}/status`)
    .set('Authorization', `Bearer ${workerToken}`)
    .send({
      status: 'confirmed',
      notes: 'Confirmed by ASHA worker. Token validated.',
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.appointment.status, 'confirmed');
});

test('POST /api/appointments/:id/cancel - patient can cancel appointment', async () => {
  // Create a new appointment to cancel
  const createRes = await request(app)
    .post('/api/appointments')
    .set('Authorization', `Bearer ${patientToken}`)
    .send({
      facility_id: 2,
      appointment_date: '2026-11-15',
      time_slot: 'afternoon',
      reason: 'Mild knee discomfort',
      priority: 'routine',
    });

  const apptId = createRes.body.appointment.id;

  const cancelRes = await request(app)
    .post(`/api/appointments/${apptId}/cancel`)
    .set('Authorization', `Bearer ${patientToken}`)
    .send({ reason: 'Feeling better, will reschedule if needed' });

  assert.strictEqual(cancelRes.status, 200);
  assert.strictEqual(cancelRes.body.success, true);
});

