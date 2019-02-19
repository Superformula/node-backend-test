#!/usr/bin/env bash

docker build -t sf .
docker-compose run -e DOCKER=true web npm run test ./models/*spec* ./*spec*

