'use strict';

const assert = require('node:assert/strict');
const { describe, it, mock } = require('node:test');

const { PAYMENT_QUEUE, createQueuePublisher } = require('../src/queue');

describe('Redis payment notification queue', () => {
  it('serializes and pushes a notification to the Redis list', async () => {
    const notification = { paymentReference: 'payment-rpush', amount: 42 };
    const redisClient = {
      isOpen: false,
      connect: mock.fn(async () => {}),
      rPush: mock.fn(async () => 1),
    };
    const publisher = createQueuePublisher({ redisClient });

    await publisher.enqueueNotification(notification);

    assert.equal(redisClient.connect.mock.callCount(), 1);
    assert.deepEqual(redisClient.rPush.mock.calls[0].arguments, [
      PAYMENT_QUEUE,
      JSON.stringify(notification),
    ]);
  });
});
