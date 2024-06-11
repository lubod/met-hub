FROM node:20-alpine AS met-hub
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY esdist/be/main.js /app/
COPY esdist/fe/* /app/html/
COPY public/* /app/html/
COPY client/index.html /app/html/
RUN ln -sf /app/html/ /app/html/callback
RUN ln -sf /app/html/ /app/html/go
CMD ["node", "/app/main.js"]

FROM node:20-alpine AS met-hub-store
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY esdist/be/store.js /app/
CMD ["node", "/app/store.js"]

FROM nginx:latest AS met-hub-nginx
COPY esdist/fe/* /usr/share/nginx/html/
COPY public/* /usr/share/nginx/html/
COPY client/index.html /usr/share/nginx/html/
COPY default-local.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /usr/share/nginx/html/ /usr/share/nginx/html/callback
RUN ln -sf /usr/share/nginx/html/ /usr/share/nginx/html/go
