FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
ENV mapboxAPIKey pk.eyJ1IjoicGF0cmlja2t3dSIsImEiOiJjamxicnd6NGQxZTc5M3huNmp3OHJudnBuIn0.KxfWwMpmMO7Frjg3wv4V8w
EXPOSE 3396
CMD [ "npm", "start" ]