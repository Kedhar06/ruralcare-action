const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/server');
const db = require('../src/db/database');
const seed = require('../src/db/seed');

test.before(() => {
  seed();
});

test('POST /api/auth/login - should authenticate valid patient user', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      identifier: '9876543210',
      password: 'Password@123',
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token);
  assert.strictEqual(res.body.user.role, 'patient');
  assert.strictEqual(res.body.user.name, 'Ramesh Kumar');
  assert.strictEqual(res.body.user.password_hash, undefined); // sensitive field must never leak
});

test('POST /api/auth/login - should reject invalid password', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      identifier: '9876543210',
      password: 'WrongPassword!',
    });

  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.success, false);
});

test('POST /api/auth/demo-login - should log in as demo health worker', async () => {
  const res = await request(app)
    .post('/api/auth/demo-login')
    .send({ role: 'health_worker' });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.user.role, 'health_worker');
  assert.strictEqual(res.body.user.worker_type, 'asha');
});

test('POST /api/auth/register - should create new patient and return token', async () => {
  const randomPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      role: 'patient',
      name: 'Narayana Reddy',
      phone: randomPhone,
      password: 'Password@123',
      village: 'Settur',
      mandal: 'Kalyandurg',
      age: 50,
      gender: 'male',
    });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.token);
  assert.strictEqual(res.body.user.name, 'Narayana Reddy');
  assert.strictEqual(res.body.user.phone, randomPhone);
});

test('POST /api/auth/register - should reject duplicate phone number', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      role: 'patient',
      name: 'Duplicate Test',
      phone: '9876543210', // already in seed
      password: 'Password@123',
    });

  assert.strictEqual(res.status, 409);
  assert.strictEqual(res.body.success, false);
});

