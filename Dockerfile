FROM node:24-alpine AS met-hub
WORKDIR /app
COPY ./package*.json .npmrc /app/
RUN npm install --omit=dev --legacy-peer-deps
COPY esdist/be/main.js /app/
COPY esdist/fe/* /app/html/
COPY public/* /app/html/
COPY client/index.html /app/html/
RUN ln -sf /app/html/ /app/html/callback && \
    addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8089/health || exit 1
CMD ["node", "/app/main.js"]

FROM node:24-alpine AS met-hub-store
WORKDIR /app
COPY ./package*.json .npmrc /app/
RUN npm install --omit=dev --legacy-peer-deps
COPY esdist/be/store.js /app/
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD pgrep -f store.js || exit 1
CMD ["node", "/app/store.js"]

FROM nginx:alpine AS met-hub-nginx
COPY esdist/fe/* /usr/share/nginx/html/
COPY public/* /usr/share/nginx/html/
COPY client/index.html /usr/share/nginx/html/
COPY default-local.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /usr/share/nginx/html/ /usr/share/nginx/html/callback
