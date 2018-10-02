FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./src .
EXPOSE 8081
CMD [ "node", "." ]