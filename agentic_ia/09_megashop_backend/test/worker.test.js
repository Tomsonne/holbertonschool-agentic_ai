'use strict';

const assert = require('node:assert/strict');
const { afterEach, describe, it, mock } = require('node:test');

const {
  GEMINI_OPENAI_BASE_URL,
  createEnvironmentAnalyzer,
  createGeminiAnalyzer,
} = require('../src/openai-analyzer');
const { createWorker } = require('../src/worker');

describe('Gemini transaction analyzer', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it('uses the Gemini OpenAI-compatible endpoint through observeOpenAI without a real API call', async () => {
    const create = mock.fn(async () => ({
      choices: [{ message: { content: 'transaction accepted' } }],
    }));
    const openAIClient = { chat: { completions: { create } } };
    const observedClient = { chat: { completions: { create } } };
    const createOpenAIClient = mock.fn(() => openAIClient);
    const observeOpenAI = mock.fn((client) => {
      assert.equal(client, openAIClient);
      return observedClient;
    });
    const analyzeTransaction = createGeminiAnalyzer({
      apiKey: 'test-key',
      model: 'test-model',
      createOpenAIClient,
      observeOpenAI,
    });
    const notification = { paymentReference: 'payment-observed' };

    const result = await analyzeTransaction(notification);

    assert.equal(observeOpenAI.mock.callCount(), 1);
    assert.deepEqual(createOpenAIClient.mock.calls[0].arguments, [{
      apiKey: 'test-key',
      baseURL: GEMINI_OPENAI_BASE_URL,
    }]);
    assert.equal(create.mock.callCount(), 1);
    assert.equal(create.mock.calls[0].arguments[0].model, 'test-model');
    assert.match(create.mock.calls[0].arguments[0].messages[0].content, /payment-observed/);
    assert.equal(result, 'transaction accepted');
  });

  it('takes the Gemini API key and model from the environment', async () => {
    const analyzeTransaction = mock.fn(async () => 'analysis');
    const createAnalyzer = mock.fn(() => analyzeTransaction);
    const environmentAnalyzer = createEnvironmentAnalyzer({
      GEMINI_API_KEY: 'environment-test-key',
      GEMINI_MODEL: 'environment-test-model',
      OPENAI_API_KEY: 'must-not-be-used',
      OPENAI_MODEL: 'must-not-be-used',
    }, { createAnalyzer });
    const notification = { paymentReference: 'payment-environment' };

    await environmentAnalyzer(notification);

    assert.deepEqual(createAnalyzer.mock.calls[0].arguments, [{
      apiKey: 'environment-test-key',
      model: 'environment-test-model',
    }]);
    assert.deepEqual(analyzeTransaction.mock.calls[0].arguments, [notification]);
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
