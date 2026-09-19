'use strict';

const { createApp } = require('./app');
const { createQueuePublisher, createRedisClient } = require('./queue');

const port = process.env.PORT || 3000;
const redisClient = createRedisClient();
const { enqueueNotification } = createQueuePublisher({ redisClient });
const app = createApp({ enqueueNotification });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
