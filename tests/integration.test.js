const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/server');
const seed = require('../src/db/seed');

let patientToken = '';
let workerToken = '';

test.before(async () => {
  seed();

  const pRes = await request(app).post('/api/auth/login').send({ identifier: '9876543210', password: 'Password@123' });
  patientToken = pRes.body.token;

  const wRes = await request(app).post('/api/auth/login').send({ identifier: '9876543220', password: 'Password@123' });
  workerToken = wRes.body.token;
});

test('GET /api/health - system health check', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
  assert.strictEqual(res.body.database, 'connected');
});

test('GET /api/facilities - filter facilities by type and search', async () => {
  const res = await request(app).get('/api/facilities?type=chc&search=Kalyandurg');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.facilities.length > 0);
  assert.strictEqual(res.body.facilities[0].type, 'chc');
});

test('GET /api/facilities/:id - facility details with doctors', async () => {
  const res = await request(app).get('/api/facilities/1');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.facility.id, 1);
  assert.ok(Array.isArray(res.body.facility.doctors));
  assert.ok(res.body.facility.doctors.length > 0);
});

test('GET /api/doctors - list and filter doctors', async () => {
  const res = await request(app).get('/api/doctors?specialty=General');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.doctors.length > 0);
});

test('POST /api/referrals - health worker creates hospital referral slip', async () => {
  const res = await request(app)
    .post('/api/referrals')
    .set('Authorization', `Bearer ${workerToken}`)
    .send({
      patient_id: 1,
      from_facility_id: 1,
      to_facility_id: 3,
      reason: 'Persistent chest discomfort requiring specialist cardiology review',
      priority: 'urgent',
      aarogyasri_case: true,
      transport_required: true,
      transport_type: 'ambulance_108',
      clinical_summary: 'ECG showed ST elevation changes. Transferring for urgent care.',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.referral.referral_code.startsWith('REF-'));
  assert.strictEqual(res.body.referral.priority, 'urgent');
});

test('GET /api/referrals - patient views their own referrals', async () => {
  const res = await request(app)
    .get('/api/referrals')
    .set('Authorization', `Bearer ${patientToken}`);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.referrals.length > 0);
  for (const ref of res.body.referrals) {
    assert.strictEqual(ref.patient_id, 1);
  }
});

test('POST /api/reminders - health worker creates preventive reminder', async () => {
  const res = await request(app)
    .post('/api/reminders')
    .set('Authorization', `Bearer ${workerToken}`)
    .send({
      patient_id: 1,
      reminder_type: 'bp_check',
      title: 'Monthly Hypertension BP Monitoring',
      due_date: '2026-11-20',
      notes: 'Morning door-to-door visit scheduled',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.reminder.reminder_type, 'bp_check');
});

test('GET /api/resources - fetch health guides and filter by category', async () => {
  const res = await request(app).get('/api/resources?category=maternal');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.resources.length > 0);
  assert.strictEqual(res.body.resources[0].category, 'maternal');
});

test('GET /api/notifications - user notifications and read status', async () => {
  const res = await request(app)
    .get('/api/notifications')
    .set('Authorization', `Bearer ${patientToken}`);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.notifications));

  if (res.body.notifications.length > 0) {
    const notifId = res.body.notifications[0].id;
    const markRes = await request(app)
      .patch(`/api/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${patientToken}`);
    assert.strictEqual(markRes.status, 200);
  }
});

