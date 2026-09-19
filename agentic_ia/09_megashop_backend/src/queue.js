'use strict';

const { createClient } = require('redis');

const PAYMENT_QUEUE = 'payments:notifications';

const createRedisClient = ({ url = process.env.REDIS_URL, logger = console } = {}) => {
  const client = createClient({ url });

  client.on('error', (error) => {
    logger.error(`Redis connection error: ${error.message}`);
  });

  return client;
};

const createQueuePublisher = ({ redisClient, logger = console }) => {
  let connectionAttempt;

  const ensureConnected = async () => {
    if (redisClient.isOpen) {
      return;
    }

    if (!connectionAttempt) {
      connectionAttempt = redisClient.connect()
        .finally(() => {
          connectionAttempt = undefined;
        });
    }

    await connectionAttempt;
  };

  const enqueueNotification = async (notification) => {
    try {
      await ensureConnected();
      await redisClient.rPush(PAYMENT_QUEUE, JSON.stringify(notification));
    } catch (error) {
      logger.error(`Redis queue publishing failed: ${error.message}`);
      throw error;
    }
  };

  return { enqueueNotification };
};

module.exports = {
  PAYMENT_QUEUE,
  createQueuePublisher,
  createRedisClient,
};
