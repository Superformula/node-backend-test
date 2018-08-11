# Superformula Backend-end Developer Test Documentation

## Overview

This project is a web API server with a REST style interface.

## Technology Stack

- Node.js
  - see `package.json` for full npm dependencies
- hapi API server
- mongodb no-sql database

## How to set up for development the first time

- Install docker and docker-compose
- Get a shell inside the hapi container
  - `./bin/docker-run.sh`
- Install the dependencies: `npm install`
- Check if the tests are passing: `npm test`
- Optionally install [the nodejs v8 inspector](https://chrome.google.com/webstore/detail/nodejs-v8-inspector/lfnddfpljnhbneopljflpombpnkfhggl?hl=en-US) chrome extension for devtools debugging

## How to do normal day-to-day development tasks

All commands below are run from a shell inside the docker container, not directly on your development computer. Run `./bin/docker-run.sh` to get a shell inside the container.

- Start the server `node .`
- Start the server with debugging
  - `node --inspect=0.0.0.0:9229 .`
  - or if you need an immediate breakpoint: `node --inspect-brk=0.0.0.0:9229 .`
  - Then in chrome browser, browse to `chrome://inspect`
- Run all the unit tests: `npm test`
- Run a single unit test file: `tap code/some-test-tap.js`
- Run a group of unit test files: `tap 'code/some-glob-*-tap.js'`
- Copy some data out of the running mongodb container to your dev machine
  - `docker-compose exec mongo bash`
  - `cp /path/to/some/file.txt /host`
  - The file will be at `datat/host/file.txt` under this repo's working directory
