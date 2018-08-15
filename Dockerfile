FROM node:8.11.3
ARG USER
ARG UID
ARG GID
WORKDIR /app
EXPOSE 3000 9229
ENV SBT_HOST=0.0.0.0
ENV PATH=/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/app/node_modules/.bin
RUN adduser --disabled-password --uid ${UID} --gid ${GID} --gecos ${USER} ${USER}
CMD ["node", "."]
