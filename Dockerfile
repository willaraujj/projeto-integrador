FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node package.json package-lock.json ./
# Certificado opcional para ambientes que utilizam proxy HTTPS.
RUN --mount=type=secret,id=npm_ca \
    if [ -f /run/secrets/npm_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca; fi; \
    npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node server.js ./
COPY --chown=node:node src ./src

USER node
EXPOSE 3000
CMD ["node", "server.js"]
