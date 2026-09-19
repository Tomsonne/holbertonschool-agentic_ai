'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, it, mock } = require('node:test');
const request = require('supertest');

const { createApp } = require('../src/app');

const waitForAsyncWork = () => new Promise((resolve) => setImmediate(resolve));

describe('asynchronous payment notification publishing', () => {
  let log;
  let error;

  beforeEach(() => {
    log = mock.method(console, 'log', () => {});
    error = mock.method(console, 'error', () => {});
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('publishes a valid notification without waiting for Redis', async () => {
    const notification = { paymentReference: 'payment-queued' };
    const neverResolvingPublication = new Promise(() => {});
    const enqueueNotification = mock.fn(() => neverResolvingPublication);
    const app = createApp({ enqueueNotification });

    const response = await request(app)
      .post('/payments/webhook')
      .send(notification)
      .timeout(500);

    await waitForAsyncWork();

    assert.equal(response.status, 200);
    assert.equal(enqueueNotification.mock.callCount(), 1);
    assert.deepEqual(enqueueNotification.mock.calls[0].arguments, [notification]);
  });

  it('never calls an LLM from the HTTP request', async () => {
    const enqueueNotification = mock.fn(async () => {});
    const analyzeTransaction = mock.fn(async () => 'analysis');
    const app = createApp({ enqueueNotification, analyzeTransaction });

    const response = await request(app)
      .post('/payments/webhook')
      .send({ paymentReference: 'payment-no-http-llm' });

    await waitForAsyncWork();

    assert.equal(response.status, 200);
    assert.equal(enqueueNotification.mock.callCount(), 1);
    assert.equal(analyzeTransaction.mock.callCount(), 0);
  });

  it('keeps the HTTP contract and logs a Redis publishing error', async () => {
    const enqueueNotification = mock.fn(async () => {
      throw new Error('Redis unavailable');
    });
    const app = createApp({ enqueueNotification });

    const response = await request(app)
      .post('/payments/webhook')
      .send({ paymentReference: 'payment-redis-error' });

    await waitForAsyncWork();

    assert.equal(response.status, 200);
    assert.equal(log.mock.callCount(), 1);
    assert.equal(error.mock.callCount(), 1);
    assert.match(error.mock.calls[0].arguments[0], /Redis unavailable/);
  });
});
