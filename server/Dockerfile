# base iamge
FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ENTRYPOINT [ "npm","start" ]