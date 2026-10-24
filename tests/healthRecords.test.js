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

test('POST /api/health-records - health worker records vitals with automated triage calculation', async () => {
  const res = await request(app)
    .post('/api/health-records')
    .set('Authorization', `Bearer ${workerToken}`)
    .send({
      patient_id: 1,
      record_date: '2026-10-24',
      visit_type: 'door_to_door',
      systolic_bp: 165,
      diastolic_bp: 102, // High BP Stage 2
      blood_glucose: 140,
      heart_rate: 82,
      spo2: 98,
      temperature_f: 98.6,
      diagnosis: 'Severe Elevated BP (Hypertensive crisis alert)',
      prescription: 'Tab. Telmisartan 40mg + Amlodipine 5mg',
      clinical_notes: 'Advised strict rest and immediate physician review.',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.record.triage_status, 'urgent'); // Auto computed by triage algorithm!
  assert.strictEqual(res.body.triage.status, 'urgent');
});

test('GET /api/health-records - patient can only view their own health records', async () => {
  const res = await request(app)
    .get('/api/health-records')
    .set('Authorization', `Bearer ${patientToken}`);

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  for (const record of res.body.records) {
    assert.strictEqual(record.patient_id, 1);
  }
});

test('GET /api/health-records/:id - patient cannot view other patient record (RBAC + Ownership)', async () => {
  // Record id 2 belongs to patient id 4 (Sunita Bai)
  const res = await request(app)
    .get('/api/health-records/2')
    .set('Authorization', `Bearer ${patientToken}`);

  assert.strictEqual(res.status, 403);
  assert.strictEqual(res.body.success, false);
});

