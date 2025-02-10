# base iamge
FROM node:23-alpine

#put all files in app directory
WORKDIR /app

#copy dependency files first
COPY package*.json ./

#install dependency
RUN npm install

#copy remaining all
COPY . ./

# Prevent Vite from opening the browser
ENV BROWSER=none

#start comand
ENTRYPOINT [ "npm", "run", "dev", "--", "--host" ]