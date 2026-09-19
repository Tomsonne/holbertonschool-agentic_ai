'use strict';

const express = require('express');

const createApp = ({ enqueueNotification } = {}) => {
  const app = express();

  app.use(express.json({
    strict: false,
    verify: (request, response, buffer) => {
      request.hasJsonPayload = buffer.length > 0;
    },
  }));

  app.use((error, request, response, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      response.sendStatus(400);
      return;
    }

    next(error);
  });

  app.post('/payments/webhook', (request, response) => {
    if (!request.hasJsonPayload || request.body === undefined) {
      response.sendStatus(400);
      return;
    }

    const notification = request.body;

    console.log(notification);
    response.sendStatus(200);

    if (enqueueNotification) {
      setImmediate(() => {
        Promise.resolve()
          .then(() => enqueueNotification(notification))
          .catch((error) => {
            console.error(`Failed to enqueue payment notification: ${error.message}`);
          });
      });
    }
  });

  return app;
};

const app = createApp();

module.exports = app;
module.exports.createApp = createApp;
