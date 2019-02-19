FROM node:10.15.1-stretch-slim
ADD . ./code
WORKDIR /code
RUN npm i
CMD node app.js
