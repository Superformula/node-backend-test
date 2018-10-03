## Overview

This folder contains configuration files for creating containers for both the Node.js web application and it's MongoDB service dependency using Docker Engine and Docker Compose. The target version for Docker Engine and Compose are 18.06.1-ce and 1.22.0 respectively. Other versions have not been tested.

This is my first attempt at using Docker Compose in development, so I have some open questions at this point, but the current implementation is sufficient to create the required images and run the containers.

## Installation

You can build the web application image by issuing a build command from the correct context:

````bash
$ cd ../
$ docker build --file ./docker/Dockerfile -t sf-nodejs-test ./
````
And then run the containers using Docker Compose:

````bash
$ docker-compose up
````

## Further Work

One issue that became immediately apparent is that using the `COPY` command in `Dockerfile` to make the Web application files available to the image means that the image must be re-compiled every time the application changes. While this is advantageous for production deployments, it does not seem feasible for rapid local development. One possible solution is to create a separate local Docker configuration (i.e. `Dockerfile.local`) which mounts local paths using `VOLUME`, or add logic to the build step which examines environment variables (i.e. `NODE_ENV`).

Another issue which deserves further inquiry is that there seems to be overlap between configuration options available in `docker-compose.yml` and `Dockerfile`. During this first attempt it was not obvious when to use either location. Similarly, while the Web application relies on PM2 to set environment variables, these could also be set in various other locations. A design choice to consolidate these options would simplify the configuration.

Lastly, I did not take the time to make the PM2 logs easily accessible, or any other service logs. Being able to tail/examine logs is obviously very helpful during development, and production environments would require proper integrations with logging systems.