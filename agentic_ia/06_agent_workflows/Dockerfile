FROM node:22-alpine

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node index.js ./
COPY --chown=node:node tasks.json ./

USER node

CMD ["npm", "start"]
