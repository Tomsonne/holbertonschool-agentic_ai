'use strict';

const OpenAI = require('openai');
const { observeOpenAI: defaultObserveOpenAI } = require('@langfuse/openai');

const GEMINI_OPENAI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

const createGeminiAnalyzer = ({
  apiKey,
  model,
  createOpenAIClient = (options) => new OpenAI(options),
  observeOpenAI = defaultObserveOpenAI,
}) => {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }

  if (!model) {
    throw new Error('GEMINI_MODEL is required');
  }

  const openAIClient = createOpenAIClient({
    apiKey,
    baseURL: GEMINI_OPENAI_BASE_URL,
  });
  const observedOpenAI = observeOpenAI(openAIClient);

  return async (notification) => {
    const response = await observedOpenAI.chat.completions.create({
      model,
      messages: [{
        role: 'user',
        content: `Analyse cette transaction de paiement sans prendre de décision métier : ${JSON.stringify(notification)}`,
      }],
    });

    return response.choices[0].message.content;
  };
};

const createEnvironmentAnalyzer = (
  environment = process.env,
  { createAnalyzer = createGeminiAnalyzer } = {},
) => {
  let analyzeTransaction;

  return async (notification) => {
    if (!analyzeTransaction) {
      analyzeTransaction = createAnalyzer({
        apiKey: environment.GEMINI_API_KEY,
        model: environment.GEMINI_MODEL,
      });
    }

    return analyzeTransaction(notification);
  };
};

module.exports = {
  GEMINI_OPENAI_BASE_URL,
  createEnvironmentAnalyzer,
  createGeminiAnalyzer,
  createOpenAIAnalyzer: createGeminiAnalyzer,
};
