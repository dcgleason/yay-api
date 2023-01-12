FROM node:alpine
COPY . /app
WORKDIR /app
CMD node server.js