FROM node:14 AS met-hub
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/be/main.js /app/
CMD ["node", "/app/main.js"]

FROM node:14 AS met-hub-store
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/be/store.js /app/
CMD ["node", "/app/store.js"]

FROM nginx:latest AS met-hub-nginx
COPY dist/fe/* /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/