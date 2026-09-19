'use strict';

const express = require('express');

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

  console.log(request.body);
  response.sendStatus(200);
});

module.exports = app;
