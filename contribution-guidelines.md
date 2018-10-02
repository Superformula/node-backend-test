# Contribution Guidelines
---
## Local Setup

### First Time Setup
To setup the app on your local development machine the first time:

1. Clone the repo locally and navigate into the root directory of the project.
2. Run `npm install`

### Running the app

1. Run `docker-compose up mongo`. This will start a local mongoDB container the api can target 
2. Run `npm start` to start the API. The npm script also injects process-level environment variables

By default, the API is available locally on port http://localhost:8081 . 
Swagger UI is available at the `/documentation` route of the API.

### Contribution Workflow
As you make code changes, the API will be reloaded by the `nodemon` process automatically. Your workflow can be as simple as:

1. Make code change
2. Make calls to the API on port 8081
3. Commit your changes

## Remote Build

When building the project on a remote build process such as CircleCI, AWS Codebuild, or Jenkins, use the following process:

1. Run `npm install --production`
2. Run `npm test`. Assure the build fails of this step does not pass.
3. Run `docker-compose build` in the root of the project to build the docker containers for mongodb and the Users API
4. Send the built images to a container repository service of your choice 

Note:

- Currently, using `docker-compose up` to run both containers can cause a few error logs from the API as the mongoDB container bootstraps. 
    - This can be avoided if a bash script is written to delay the initialization of the Node.js process for the API until the mongo container is healthy.

## Code Guidelines

### General

- All route definitions should add `tags: ['api']` to the `options` property to register with swagger
- The API container expects all runtime values to be defined in its environment.
- All environment variables should be prefixed with SUPF_USERS, short for Superformula Users resource.
- All mongo-specific actions should be kept out of route handlers and put into hapi's server.methods 

### Responses

- All routes should follow the response standards noted in the Responses section of `docs.md` 
- All responses communicating an unsuccessful operation should use Boom response objects.
- All inter-process calls should contain retry strategies to account for temporary downstream failures

### Error Handling
- All async operations should be wrapped in a try-catch
- All `catch` blocks should make every attempt to account for explicit failures before defaulting to 500 (internal) as the last resort.

### Testing

- Tests use the `lab` testing library and related tooling
- Any business or domain-specific rules specifically coded for should have assciated unit tests
    - Example: If it is expected that all new users have a `name` property filled in, unit tests should verify that the POST and PUT endpoints exhibit that rule.
- Any behavior with possible financial or system integrity impact should be integration tested 
    - Example: If deleting a user should not actually delete the record but instead archive it, it should be accounted for in unit tests.
- Refrain from testing code entirely outsourced to a framework or library.
- All integration tests should leave no runtime resources behind