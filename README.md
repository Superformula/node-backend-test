# Superformula Cloud-native User API

A RESTful API that can `create/read/update/delete` user data from a persistence store.

## Approach

**CloudFormation**

* All resource management is done via a CloudFormation template: [superformula-api.template](templates/superformula-api.template).
* There are three optional features of the API that are enabled via parameters:
    * API key authentication - When enabled, resources are created to control authentication via ApiGateway API keys.
    * Alarms - When enabled, an SNS topic and 4 CloudWatch alarms are created.
    * DynamoDB auto-scaling - When enabled, the database will be configured to auto-scale. 

**CloudFront**  

* Both the API and documentation site are delivered through the same CloudFront distribution.
* The API _requires_ an https connection, where as the documentation site will _redirect_ the user to https automatically.
* All _GET_ requests are cached. This includes both API and documentation requests.
* The distribution will forward any querystring parameters onto the API (for _GET_ filtering).

**ApiGateway**

* A _v1_ resource is included, for API versioning.
* The methods (endpoints) are configured to format:
    * Incoming requests - A JSON object containing a body, method, uri and params.
    * Outgoing responses - A JSON object configured to meet the [JSON:API](https://jsonapi.org) specification.
* Response status codes follow [HTTP Status Code Standards](https://www.restapitutorial.com/httpstatuscodes.html).

**Lambda**

* Each endpoint triggers it's own Lambda function, this is best for separation of concerns.
* Each function is built via [webpack](https://webpack.js.org/), which is responsible for:
    * Bundling node packages within the source code.
    * Triggering [Babel](https://babeljs.io/) in order to transpile and polyfill the source code.
    * Minifying the source code, when called with the _production_ flag.
    * Zip archiving the final function source code into separate archives.
* Custom models are responsible for:
    * Whitelisting attributes.
    * Validation constraints for that object. Validation is handled via [validate.js](https://validatejs.org/).
    * Converting user input into object parameters.
    * Hold the configuration for dynamodb-data-mapper.
* Custom exceptions are thrown to simplify HTTP error messages and status codes.
* All messages are logged to CloudWatch groups.

**DynamoDB**

* A single table is used to store all user data.
* If enabled, the users table will auto-scale.
* AWS's [dynamodb-data-mapper](https://github.com/awslabs/dynamodb-data-mapper-js) is used to translate, and query data.

**Documentation**

* During the build process, documentation is generated via [apiDoc](http://apidocjs.com/).
* apiDoc is configured to build using placeholder tags: `{{API_URL}}`.
* The generated documentation is then released to a S3 bucket.
* During the stack creation process, the documentation files are copied from the release bucket, to a new S3 bucket created by the stack.
* Also during the stack creation process, the placeholder tags are replaced with the API url specific to that stack.

**Testing**

* Unit tests are available for all user-facing functionality.
* 100% code coverage was the goal, and that goal has been reached.

## Installation

There are two approaches to installing this solution; automatic and manual:

**Automatic**

1. Be sure you are signed-in to your [AWS console](https://console.aws.amazon.com).

2. Click on the Launch Stack button.
    [![Launch Stack](https://cdn.rawgit.com/buildkite/cloudformation-launch-stack-button-svg/master/launch-stack.svg)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=Superformula&templateURL=https://superformula.s3.amazonaws.com/superformula-api.template)

3. Click the "Next" button.

4. Configure your stack name and parameters, and click the "Next" button.

5. Configure your stack options (most people won't need to do anything on this screen), and click the "Next" button.

6. Review the stack settings, Check the acknowledgement box, and click the "Create stack" button.

**Manual**

1. Be sure you have the following prerequisites installed:
    * [AWS Command Line Interface](https://aws.amazon.com/cli/)
    * [NodeJS](https://nodejs.org)

2. Clone the repo (or download the project from Github) and install the project dependencies.
    ```bash
    git clone git@github.com:cj-ohara/node-backend-test.git
    cd node-backend-test
    npm install
    ```

3. Sign into your [AWS console](https://console.aws.amazon.com) and navigate to S3.

4. You will need to create at least one bucket to release and create a new stack. Be sure that bucket is created in the region you'd like the stack to be created in.

5. During the `npm install` process, a `.env` file was created, set all values in the .env file to the name of the bucket that was created in the previous step.

6. Run the release script.
    ```bash
    npm run release
    ```

7. The release script will call the build scripts and generate the API documentation, Lambda functions and CloudFormation templates.
These files can be found in the `dist/` directory in the root of the project.

8. In the AWS console, navigate to CloudFormation, select "Create stack", select "Upload a template file", and browse to `dist/templates/superformula-api.template`.

9. Click the "Next" button.

10. Configure your stack name and parameters, and click the "Next" button.

11. Configure your stack options (most people won't need to do anything on this screen), and click the "Next" button.

12. Review the stack settings, Check the acknowledgement box, and click the "Create stack" button.

## Running Tests

1. From the root of the project, make sure you have the project's dependencies installed:
    ```bash
    npm install
    ```

2. Run the tests:
    ```bash
    npm test
    ```