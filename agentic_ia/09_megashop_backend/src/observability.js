'use strict';

const { LangfuseSpanProcessor } = require('@langfuse/otel');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

const registerLangfuseTracing = () => {
  const provider = new NodeTracerProvider({
    spanProcessors: [new LangfuseSpanProcessor()],
  });

  provider.register();
  return provider;
};

module.exports = { registerLangfuseTracing };
