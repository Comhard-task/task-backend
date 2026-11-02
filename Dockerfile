# ========================================================


FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN mkdir -p /app/logs && chown -R node:node /app

COPY package*.json ./

RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --chown=node:node . .
USER node

EXPOSE 5000

CMD ["node", "server.js"]
