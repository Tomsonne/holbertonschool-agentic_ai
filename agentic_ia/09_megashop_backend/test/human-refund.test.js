'use strict';

const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');
const { describe, it, mock } = require('node:test');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

const { createWorker } = require('../src/worker');
const { confirmRefund } = require('../src/human-refund');
const { createScoreRecorder, withNotificationTrace } = require('../src/observability');

const logger = () => ({ log: mock.fn(), error: mock.fn() });

const setup = (notifications, answers) => {
  const pending = [...notifications];
  const redisClient = {
    blPop: mock.fn(async () => pending.length
      ? { element: JSON.stringify(pending.shift()) }
      : null),
  };
  const askConfirmation = mock.fn(async () => answers.shift());
  const scores = [];
  let traceNumber = 0;
  const withTrace = mock.fn(async (work) => work(`trace-${++traceNumber}`));
  const recordScore = mock.fn(async (score) => { scores.push(score); });
  const analyzeTransaction = mock.fn(async () => 'Gemini says refund');
  const worker = createWorker({
    redisClient, analyzeTransaction, askConfirmation, withTrace, recordScore,
    logger: logger(),
  });
  return { worker, redisClient, askConfirmation, scores, recordScore, analyzeTransaction, withTrace };
};

describe('human refund pre-hook', () => {
  it('accepts o and scores the notification trace before analysis', async () => {
    const notification = { type: 'refund' };
    const flow = setup([notification], [true]);

    assert.equal(await flow.worker.processNext(), true);
    assert.deepEqual(flow.scores, [{ traceId: 'trace-1', name: 'human_refund_approval', value: 1 }]);
    assert.equal(flow.analyzeTransaction.mock.callCount(), 1);
    assert.deepEqual(flow.analyzeTransaction.mock.calls[0].arguments, [notification]);
  });

  it('refuses n, then resumes with the next queued notification', async () => {
    const flow = setup([{ type: 'refund' }, { type: 'payment' }], [false]);

    assert.equal(await flow.worker.processNext(), true);
    assert.equal(flow.analyzeTransaction.mock.callCount(), 0);
    assert.equal(await flow.worker.processNext(), true);
    assert.equal(flow.analyzeTransaction.mock.callCount(), 1);
    assert.deepEqual(flow.scores, [{ traceId: 'trace-1', name: 'human_refund_approval', value: 0 }]);
  });

  it('repeats invalid and empty replies without intermediate scores', async () => {
    const flow = setup([{ type: 'refund' }], []);
    const replies = ['', 'O', 'o ', 'o'];
    const question = mock.fn(async () => {
      assert.equal(flow.scores.length, 0);
      return replies.shift();
    });
    flow.askConfirmation.mock.mockImplementation(() => confirmRefund({
      input: { isTTY: true },
      output: {},
      createInterface: () => ({ question, close: () => {}, once: () => {} }),
    }));

    await flow.worker.processNext();

    assert.equal(flow.askConfirmation.mock.callCount(), 1);
    assert.equal(question.mock.callCount(), 4);
    assert.equal(flow.scores.length, 1);
    assert.equal(flow.scores[0].value, 1);
  });

  it('fails closed on closed or unavailable input, even after an invalid reply', async () => {
    for (const answers of [[new Error('closed')], ['bad', new Error('closed')]]) {
      const flow = setup([{ type: 'refund' }], []);
      flow.askConfirmation.mock.mockImplementation(() => confirmRefund({
        input: { isTTY: true },
        output: {},
        createInterface: () => ({
          question: async () => {
            const answer = answers.shift();
            if (answer instanceof Error) throw answer;
            return answer;
          },
          close: () => {},
          once: () => {},
        }),
      }));

      assert.equal(await flow.worker.processNext(), true);
      assert.equal(flow.analyzeTransaction.mock.callCount(), 0);
      assert.deepEqual(flow.scores, [{ traceId: 'trace-1', name: 'human_refund_approval', value: 0 }]);
    }
  });

  it('does not ask or score when type differs, regardless of Gemini text', async () => {
    const flow = setup([{}, { type: 'Refund' }, { type: 'payment' }], []);

    await flow.worker.processNext();
    await flow.worker.processNext();
    await flow.worker.processNext();

    assert.equal(flow.askConfirmation.mock.callCount(), 0);
    assert.equal(flow.recordScore.mock.callCount(), 0);
    assert.equal(flow.analyzeTransaction.mock.callCount(), 3);
  });

  it('keeps following notifications in Redis during the sole active prompt', async () => {
    let resolveAnswer;
    const flow = setup([{ type: 'refund' }, { type: 'refund' }], []);
    flow.askConfirmation.mock.mockImplementationOnce(() => new Promise((resolve) => { resolveAnswer = resolve; }));

    const first = flow.worker.processNext();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(flow.redisClient.blPop.mock.callCount(), 1);
    assert.equal(flow.askConfirmation.mock.callCount(), 1);
    resolveAnswer(true);
    await first;
    assert.equal(flow.redisClient.blPop.mock.callCount(), 1);
    await flow.worker.processNext();
    assert.deepEqual(flow.scores.map(({ traceId }) => traceId), ['trace-1', 'trace-2']);
  });

  it('continues after Langfuse score failure', async () => {
    const flow = setup([{ type: 'refund' }, { type: 'payment' }], [true]);
    flow.recordScore.mock.mockImplementationOnce(async () => { throw new Error('Langfuse unavailable'); });

    assert.equal(await flow.worker.processNext(), true);
    assert.equal(await flow.worker.processNext(), true);
    assert.equal(flow.analyzeTransaction.mock.callCount(), 2);
  });
});

describe('readline confirmation', () => {
  it('closes the interface after a decision or an error', async () => {
    for (const answer of ['o', new Error('closed')]) {
      const input = { isTTY: true, destroyed: false, readableEnded: false };
      const close = mock.fn();
      const question = mock.fn(async () => {
        if (answer instanceof Error) throw answer;
        return answer;
      });
      const approved = await confirmRefund({ input, output: {}, createInterface: () => ({ question, close, once: () => {} }) });
      assert.equal(approved, answer === 'o');
      assert.equal(close.mock.callCount(), 1);
    }
  });

  it('refuses unavailable stdin without creating an interface', async () => {
    const createInterface = mock.fn();
    assert.equal(await confirmRefund({ input: { isTTY: false }, createInterface }), false);
    assert.equal(createInterface.mock.callCount(), 0);
  });

  it('fails closed when an active stream reaches EOF', async () => {
    const input = new PassThrough();
    input.isTTY = true;
    const output = new PassThrough();
    const decision = confirmRefund({ input, output });
    input.end();

    assert.equal(await Promise.race([
      decision,
      new Promise((_, reject) => setTimeout(() => reject(new Error('input remained pending')), 100)),
    ]), false);
  });
});

it('records a score through the installed Langfuse client API', async () => {
  const create = mock.fn(async () => ({}));
  const createClient = mock.fn(() => ({ scores: { create } }));
  const recordScore = createScoreRecorder({
    LANGFUSE_PUBLIC_KEY: 'test-public',
    LANGFUSE_SECRET_KEY: 'test-secret',
    LANGFUSE_BASE_URL: 'https://langfuse.test',
  }, createClient);
  const score = { traceId: 'trace-42', name: 'human_refund_approval', value: 1 };

  await recordScore(score);

  assert.deepEqual(create.mock.calls[0].arguments, [score]);
  assert.deepEqual(createClient.mock.calls[0].arguments, [{
    environment: 'default',
    baseUrl: 'https://langfuse.test',
    username: 'test-public',
    password: 'test-secret',
  }]);
});

it('creates a different real trace ID for each notification', async () => {
  new NodeTracerProvider().register();
  const first = await withNotificationTrace(async (traceId) => traceId);
  const second = await withNotificationTrace(async (traceId) => traceId);

  assert.match(first, /^[a-f0-9]{32}$/);
  assert.match(second, /^[a-f0-9]{32}$/);
  assert.notEqual(first, second);
});
