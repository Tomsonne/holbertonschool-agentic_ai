'use strict';

const { LangfuseSpanProcessor } = require('@langfuse/otel');
const { LangfuseAPIClient } = require('@langfuse/core');
const { startActiveObservation } = require('@langfuse/tracing');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

const registerLangfuseTracing = () => {
  const provider = new NodeTracerProvider({
    spanProcessors: [new LangfuseSpanProcessor()],
  });

  provider.register();
  return provider;
};

const withNotificationTrace = async (work) => {
  let entered = false;
  try {
    return await startActiveObservation('payment-notification', async (observation) => {
      entered = true;
      return work(observation.traceId);
    });
  } catch (error) {
    if (entered) throw error;
    console.error(`Langfuse trace error: ${error.message}`);
    return work(undefined);
  }
};

const createScoreRecorder = (
  environment = process.env,
  createClient = (options) => new LangfuseAPIClient(options),
) => {
  let client;
  return async ({ traceId, name, value }) => {
    if (!traceId || !environment.LANGFUSE_PUBLIC_KEY || !environment.LANGFUSE_SECRET_KEY) {
      throw new Error('Langfuse trace or credentials unavailable');
    }
    if (!client) {
      client = createClient({
        environment: 'default',
        baseUrl: environment.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
        username: environment.LANGFUSE_PUBLIC_KEY,
        password: environment.LANGFUSE_SECRET_KEY,
      });
    }
    await client.scores.create({ traceId, name, value });
  };
};

module.exports = { registerLangfuseTracing, withNotificationTrace, createScoreRecorder };
