FROM node:14 AS met-hub
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/main.js /app/
CMD ["node", "/app/main.js"]

FROM node:14 AS store
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/store.js /app/
CMD ["node", "/app/store.js"]