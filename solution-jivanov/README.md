### OVERVIEW
This is a serverless implementation of CRUD for DynamoDB on NodeJS, exposed as REST endpoints via API gateway. 
Computing layer is AWS Lambda. Utilizing serverless framework as orchestration tool, leveraging Infrastructure-as-code (IaC).

---

### KISS
My overarching approach to implementations is [KISS](https://en.wikipedia.org/wiki/KISS_principle). Keep it as simple as possible, as straightforward as possible. Both architecture-wise as
well as code-wise. Don't try to shove every trick from the book in there. Instead, just "KISS" it. 
Emphasize on readability, maintenability and extensibility. Simple as that!

---

### HOW TO INSTALL
Thanks to CloudFormation and our tooling (Serverless) we are able to write all infrastructure as code (IaC). That in turn really simplifies our installation task:

First, make sure you have [Serverless Framework](https://serverless.com/) installed and properly configured (refer to [their get started page](https://serverless.com/framework/docs/getting-started/) as needed)

After that to install all dependencies please run the (all popular) command of:

`npm install`


### HOW TO RUN TESTS

We are utilizing [Jest](https://jestjs.io/) as testing framework. It is already setup in our project. To execute all the automated tests simply run:

`npm run test`



### HOW TO DEPLOY
The whole project is architected with multiple environments in mind (dev, staging, prod, other as needed). Currently "dev" is setup as default. For added flexibility, as well as to keep it simple (and as advised in the [serverless docs](https://serverless.com/framework/docs/providers/aws/guide/credentials/)) each environment correspond to a separate AWS profile. Dev environment corresponds to "dev" profile. For that reason please make sure you have an AWS profile named "dev" set up, before you attempt a deploy with:


`serverless deploy -v`

Thanks to the Infrastuture-as-code (IaC) the above command will provision all the needed infrastructure, deploy all the code, setup endpoints,
 usage plans, database, anything and everything.\
 It will return the AWS secret key as well as the actual endpoints URL. Please note all of those, you will need them to make it work in the next step.  

### HOW TO USE
Upon successfull deployment there will be 4 REST endpoints created as outlined below. Each one handles a particular CRUD operation as follows:

**POST /users** - performs CREATE operation i.e. creates a new user record. Returns the newly created user ID (uuid of the user)

example:\
`curl -X POST -H "x-api-key: KEY_HERE" https://AWS_URL_HERE/dev/users --data '{"name": "TEST User 8", "dob":"1970-07-17", "address": "Mandalay Bay Blvd 17", "description":"This is a test user"}'`

--

**GET /users/{id}** - performs READ operation i.e. retrieves user record details by the given user ID (uuid)

`curl -X GET -H "x-api-key: KEY_HERE" https://AWS_URL_HERE/dev/users/USER_UUID_HERE`

--

**POST /users/{id}** - performs UPDATE operation i.e. updates user record data of the given user ID (uuid)

`curl -X POST -H "x-api-key: KEY_HERE" https://AWS_URL_HERE/dev/users/USER_UUID_HERE --data '{"dob":"1980-08-18"}'`

--

**DELETE /users/{id}** - performs DELETE operation i.e. removes user record with the given user ID (uuid)

`curl -X DELETE -H "x-api-key: KEY_HERE" https://AWS_URL_HERE/dev/users/USER_UUID_HERE`

--

**Important note:** each endpoint is protected with an API key. It will be generated upon deployment and displayed on-screen (look at the deployment section above). It must be provided as part of the request header "x-api-key: API_KEY_HERE"


**Response model** (for all of the above operations):
```
{
    message: "success or error message",
    itemId: "the UUID of the user the request has been made with or the generated one upon CREATE",
    data: "optional data returned by READ which will contain the full user record,
    timestamp: "UTC timestamp of the operation"
 }
 ```
 
 
---

### Filesystem structure
- `/` - root folder contains config files and handlers of the endpoints
- `/serverless.yml` - main microservices config file (IaC)
- `/dynamodb.yml` - CloudFormation IaC directives to provision the DB  
- `models/` - contains all model files/classes
- `services/` - contains all services classes


### Additional notes:
1. Utilizing the isomorphic ValidationJS library for the input validations. That would allow to re-use the same on the frontend too (and potentially leverage the full-stack javascript).
2. Field validations are kept at minimum at this time (due to none specified in the requirements), but could be easily amended thanks to the above mentioned library.
3. 'Name' is the only mandatory field (when creating a new record); that is to avoid creating empty user records.
4. All service errors are returned as 4xx; 5xx are reserved for infrastructure (AWS) errors; HTTP code of 200 is OK/success.
5. All returned error messages are prefixed with "ERROR:" for easier identification.
6. There's a sample usage plan configured in the serverless.yml file that implements throttling and quota settings. 
7. For added security each endpoint is protected with an API key generated upon deployment.
8. The configuration is architected with multiple environments in mind (dev, staging, prod, other as needed); currently "dev" is setup as default.
