'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const request = require('supertest');

const app = require('../src/app');

describe('POST /payments/webhook', () => {
  let log;

  beforeEach(() => {
    log = mock.method(console, 'log', () => {});
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('logs a valid JSON notification and returns 200', async () => {
    const notification = { paymentReference: 'payment-123', amount: 42 };

    const response = await request(app)
      .post('/payments/webhook')
      .send(notification);

    assert.equal(response.status, 200);
    assert.equal(log.mock.callCount(), 1);
    assert.deepEqual(log.mock.calls[0].arguments, [notification]);
  });

  it('accepts valid JSON with no predefined business field', async () => {
    const response = await request(app)
      .post('/payments/webhook')
      .send({});

    assert.equal(response.status, 200);
    assert.equal(log.mock.callCount(), 1);
  });

  it('accepts valid JSON containing unknown fields', async () => {
    const notification = { unexpected: true, nested: { value: 1 } };

    const response = await request(app)
      .post('/payments/webhook')
      .send(notification);

    assert.equal(response.status, 200);
    assert.deepEqual(log.mock.calls[0].arguments, [notification]);
  });

  it('returns 400 and does not log malformed JSON', async () => {
    const response = await request(app)
      .post('/payments/webhook')
      .set('Content-Type', 'application/json')
      .send('{"broken":');

    assert.equal(response.status, 400);
    assert.equal(log.mock.callCount(), 0);
  });

  it('returns 400 and does not log an absent or empty body', async () => {
    const absentResponse = await request(app)
      .post('/payments/webhook');
    const emptyResponse = await request(app)
      .post('/payments/webhook')
      .set('Content-Type', 'application/json')
      .set('Content-Length', '0');

    assert.equal(absentResponse.status, 400);
    assert.equal(emptyResponse.status, 400);
    assert.equal(log.mock.callCount(), 0);
  });

  it('logs two identical notifications independently', async () => {
    const notification = { repeated: true };

    const firstResponse = await request(app)
      .post('/payments/webhook')
      .send(notification);
    const secondResponse = await request(app)
      .post('/payments/webhook')
      .send(notification);

    assert.equal(firstResponse.status, 200);
    assert.equal(secondResponse.status, 200);
    assert.equal(log.mock.callCount(), 2);
  });

  it('handles simultaneous notifications independently', async () => {
    const responses = await Promise.all(
      Array.from({ length: 5 }, (_, index) => request(app)
        .post('/payments/webhook')
        .send({ index })),
    );

    assert.deepEqual(responses.map(({ status }) => status), [200, 200, 200, 200, 200]);
    assert.equal(log.mock.callCount(), 5);
  });

  it('responds immediately without waiting for business processing', async () => {
    const startedAt = Date.now();

    const response = await request(app)
      .post('/payments/webhook')
      .send({ event: 'received' })
      .timeout(500);

    assert.equal(response.status, 200);
    assert.ok(Date.now() - startedAt < 500);
  });
});
