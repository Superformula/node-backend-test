# RESTful API with CRUD Endpoints for Managing Golf Athletes

This project is an implementation of a RESTful API that can create/read/update/delete golf athlete data from a persistence store. The API follows RESTful API design patterns and best practices.

## API Documentation

- See [swagger.json](swagger.json)
- After starting the application locally, view via the Swagger UI at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

## Built With

* [Node.js](https://nodejs.org/) - JavaScript runtime
* [Express](https://expressjs.com/) - Node.js web application framework
* [MongoDB](https://www.mongodb.com/) - NoSQL database
* [Standard](https://standardjs.com/) - Javascript style guide, linter, and formatter
* [SuperTest](https://github.com/visionmedia/supertest) - Library for testing Node.js HTTP servers
* [Mocha](https://mochajs.org/) - JavaScript test framework
* [Chai](https://www.chaijs.com/) - JavaScript assertion library

## Getting Started

These instructions will get this project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Install MongoDB and run it as a service
- (Optional) Seed the database with a few records by running `node bin\seed-golfathlete-db.js`

### Installing

- Install the dependencies `npm install`

## Running the tests

- `npm run test` runs the style and linting tests followed by all the unit and integration tests with coverage
- `npm run test:coverage` only runs the unit and integration tests with coverage
- `npm run test:all` only runs the unit and integration tests

### And coding style tests

- `npm run stylint` runs the style and linting tests only (no fixing; currently excludes the test directory due to Mocha - todo)
- `npm run stylint:fix` runs the style and linting tests and fixes all the *.js files in the project

## Deployment (Local)

- `npm run devstart` starts the application in debug mode
- `npm run start` starts the application normally
- View the API document via the Swagger UI at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)
- Use an API client like Insomnia or Postman to functionally test the endpoints

## Authors

* **Charlie Udom** 

## License

This project is licensed under the ISC License - see the [ISC License (ISC)](https://opensource.org/licenses/ISC) for details

## Acknowledgments

* Thanks to **Billie Thompson** for providing a clean and concise [README.md](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) template.

