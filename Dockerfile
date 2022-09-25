FROM node:16 AS met-hub
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/be/main.js /app/
CMD ["node", "/app/main.js"]

FROM node:16 AS met-hub-store
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/be/store.js /app/
CMD ["node", "/app/store.js"]

FROM nginx:latest AS met-hub-nginx
COPY dist/fe/* /usr/share/nginx/html/
COPY public/* /usr/share/nginx/html/
COPY default-local.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /usr/share/nginx/html/ /usr/share/nginx/html/callback
