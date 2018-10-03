FROM keymetrics/pm2:latest-stretch
COPY ./webapp /webapp
RUN npm i pm2 -g
COPY ./docker/process.yml /webapp
WORKDIR /webapp
RUN npm install
CMD ["pm2-runtime", "process.yml"]