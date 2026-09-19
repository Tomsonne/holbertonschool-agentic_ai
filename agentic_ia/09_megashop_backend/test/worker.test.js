'use strict';

const assert = require('node:assert/strict');
const { afterEach, describe, it, mock } = require('node:test');

const { createOpenAIAnalyzer } = require('../src/openai-analyzer');
const { createWorker } = require('../src/worker');

describe('OpenAI transaction analyzer', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it('wraps the OpenAI client with observeOpenAI without a real API call', async () => {
    const create = mock.fn(async () => ({ output_text: 'transaction accepted' }));
    const openAIClient = { responses: { create } };
    const observedClient = { responses: { create } };
    const createOpenAIClient = mock.fn(() => openAIClient);
    const observeOpenAI = mock.fn((client) => {
      assert.equal(client, openAIClient);
      return observedClient;
    });
    const analyzeTransaction = createOpenAIAnalyzer({
      apiKey: 'test-key',
      model: 'test-model',
      createOpenAIClient,
      observeOpenAI,
    });
    const notification = { paymentReference: 'payment-observed' };

    const result = await analyzeTransaction(notification);

    assert.equal(observeOpenAI.mock.callCount(), 1);
    assert.equal(create.mock.callCount(), 1);
    assert.equal(create.mock.calls[0].arguments[0].model, 'test-model');
    assert.match(create.mock.calls[0].arguments[0].input, /payment-observed/);
    assert.equal(result, 'transaction accepted');
  });
});

describe('payment notification worker', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it('consumes and analyzes a notification from Redis', async () => {
    const notification = { paymentReference: 'payment-consumed' };
    const redisClient = {
      blPop: mock.fn(async () => ({ element: JSON.stringify(notification) })),
    };
    const analyzeTransaction = mock.fn(async () => 'analysis result');
    const logger = {
      log: mock.fn(),
      error: mock.fn(),
    };
    const worker = createWorker({ redisClient, analyzeTransaction, logger });

    const processed = await worker.processNext();

    assert.equal(processed, true);
    assert.deepEqual(analyzeTransaction.mock.calls[0].arguments, [notification]);
    assert.equal(logger.log.mock.callCount(), 1);
  });

  it('continues consuming after an LLM error', async () => {
    const notifications = [
      { paymentReference: 'payment-llm-error' },
      { paymentReference: 'payment-after-error' },
    ];
    const redisClient = {
      blPop: mock.fn(async () => ({ element: JSON.stringify(notifications.shift()) })),
    };
    let attempt = 0;
    const analyzeTransaction = mock.fn(async () => {
      attempt += 1;
      if (attempt === 1) {
        throw new Error('LLM unavailable');
      }
      return 'analysis recovered';
    });
    const logger = {
      log: mock.fn(),
      error: mock.fn(),
    };
    const worker = createWorker({ redisClient, analyzeTransaction, logger });

    await worker.processNext();
    const processedAfterError = await worker.processNext();

    assert.equal(processedAfterError, true);
    assert.equal(analyzeTransaction.mock.callCount(), 2);
    assert.equal(logger.error.mock.callCount(), 1);
    assert.equal(logger.log.mock.callCount(), 1);
  });

  it('continues consuming after a Redis error', async () => {
    const notification = { paymentReference: 'payment-after-redis-error' };
    let attempt = 0;
    const redisClient = {
      blPop: mock.fn(async () => {
        attempt += 1;
        if (attempt === 1) {
          throw new Error('Redis connection lost');
        }
        return { element: JSON.stringify(notification) };
      }),
    };
    const analyzeTransaction = mock.fn(async () => 'analysis recovered');
    const logger = {
      log: mock.fn(),
      error: mock.fn(),
    };
    const worker = createWorker({ redisClient, analyzeTransaction, logger });

    const failedAttempt = await worker.processNext();
    const recoveredAttempt = await worker.processNext();

    assert.equal(failedAttempt, false);
    assert.equal(recoveredAttempt, true);
    assert.equal(analyzeTransaction.mock.callCount(), 1);
    assert.equal(logger.error.mock.callCount(), 1);
  });
});
