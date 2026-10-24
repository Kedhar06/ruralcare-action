const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/server');

test('POST /api/ai/navigate - should identify emergency symptoms and route to 108', async () => {
  const res = await request(app)
    .post('/api/ai/navigate')
    .send({
      query: 'Patient is having severe chest pain and cannot breathe properly',
      lang: 'en',
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.isEmergency, true);
  assert.ok(res.body.text.includes('108'));
  assert.ok(res.body.actions.some((a) => a.url === 'tel:108'));
});

test('POST /api/ai/navigate - should respond in Telugu when requested', async () => {
  const res = await request(app)
    .post('/api/ai/navigate')
    .send({
      query: 'ఓపీడీ టోకెన్ ఎలా బుక్ చేసుకోవాలి?',
      lang: 'te',
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.isEmergency, false);
  assert.ok(res.body.text.includes('టోకెన్'));
});

test('POST /api/ai/navigate - should provide Aarogyasri cashless details', async () => {
  const res = await request(app)
    .post('/api/ai/navigate')
    .send({
      query: 'How does Aarogyasri scheme work for surgery?',
      lang: 'en',
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.text.includes('5 lakh'));
});

