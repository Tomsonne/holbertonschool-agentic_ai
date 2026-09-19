'use strict';

const OpenAI = require('openai');
const { observeOpenAI: defaultObserveOpenAI } = require('@langfuse/openai');

const createOpenAIAnalyzer = ({
  apiKey,
  model,
  createOpenAIClient = (options) => new OpenAI(options),
  observeOpenAI = defaultObserveOpenAI,
}) => {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }

  if (!model) {
    throw new Error('OPENAI_MODEL is required');
  }

  const openAIClient = createOpenAIClient({ apiKey });
  const observedOpenAI = observeOpenAI(openAIClient);

  return async (notification) => {
    const response = await observedOpenAI.responses.create({
      model,
      input: `Analyse cette transaction de paiement sans prendre de décision métier : ${JSON.stringify(notification)}`,
    });

    return response.output_text;
  };
};

const createEnvironmentAnalyzer = (environment = process.env) => {
  let analyzeTransaction;

  return async (notification) => {
    if (!analyzeTransaction) {
      analyzeTransaction = createOpenAIAnalyzer({
        apiKey: environment.OPENAI_API_KEY,
        model: environment.OPENAI_MODEL,
      });
    }

    return analyzeTransaction(notification);
  };
};

module.exports = {
  createEnvironmentAnalyzer,
  createOpenAIAnalyzer,
};
