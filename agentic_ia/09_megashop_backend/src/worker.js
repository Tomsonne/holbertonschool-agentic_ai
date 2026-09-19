'use strict';

const { createEnvironmentAnalyzer } = require('./openai-analyzer');
const { registerLangfuseTracing } = require('./observability');
const { PAYMENT_QUEUE, createRedisClient } = require('./queue');

const wait = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

const createWorker = ({
  redisClient,
  analyzeTransaction,
  logger = console,
  queueName = PAYMENT_QUEUE,
}) => {
  let running = true;

  const processNext = async () => {
    try {
      const queuedNotification = await redisClient.blPop(queueName, 1);

      if (!queuedNotification) {
        return false;
      }

      const notification = JSON.parse(queuedNotification.element);
      const result = await analyzeTransaction(notification);
      logger.log('Transaction analysis result:', result);
      return true;
    } catch (error) {
      logger.error(`Worker processing error: ${error.message}`);
      return false;
    }
  };

  const run = async () => {
    while (running) {
      try {
        if (!redisClient.isOpen) {
          await redisClient.connect();
        }

        await processNext();
      } catch (error) {
        logger.error(`Worker Redis connection error: ${error.message}`);
      }

      if (running && !redisClient.isReady) {
        await wait(1000);
      }
    }
  };

  const stop = () => {
    running = false;
  };

  return { processNext, run, stop };
};

const startWorker = async () => {
  try {
    registerLangfuseTracing();
  } catch (error) {
    console.error(`Langfuse initialization error: ${error.message}`);
  }

  const redisClient = createRedisClient();
  const analyzeTransaction = createEnvironmentAnalyzer();
  const worker = createWorker({ redisClient, analyzeTransaction });

  console.log('Payment notification worker started');
  await worker.run();
};

if (require.main === module) {
  startWorker().catch((error) => {
    console.error(`Worker startup error: ${error.message}`);
  });
}

module.exports = {
  createWorker,
  startWorker,
};
