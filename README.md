# SF Users API

## About

The "SF Users" API is built and deployed using the AWS Cloud Development Kit (CDK). The stack consists of API Gateway endpoints integrated with Lambda running Node.js. Data storage is in DynamoDB.

Payload validation is handled within API Gateway, prior to hitting Lambda. This avoids triggering Lambda executions when a payload is invalid.

The DynamoDB data store intentionally uses generically named partion and sort keys, 'pk' and 'sk', to allow for future expansion, using access patterns not yet determined. Dynamo tables are commonly stacked with multiple kinds of data. In our case, using 'pk' and 'sk' would allow for storage of other non-user specific data down the road. There is a Global Secondary Index which makes it possible to do partial lookups against a sort key of state#city#zip, in order to return users in a particular state, or city, or zipcode.

There is one Lambda Layer containing the NPM packages leveraged by the four CRUD lambdas. Individual Lambdas handle Create, Read, Update and Delete actions. Resuse of HTTP connection is enabled. There is an SQS dead letter queue attached to each Lambda.

Logging from lambda is done to CloudWatch with recommended AWS attributes, like this:

```json
{
    "timestamp": "2019-08-22 18:17:33,774",
    "level": "INFO",
    "location": "handler:1",
    "service": "payment",
    "lambda_function_name": "test",
    "lambda_function_memory_size": "128",
    "lambda_function_arn": "arn:aws:lambda:eu-west-1:12345678910:function:test",
    "lambda_request_id": "52fdfc07-2182-154f-163f-5f0f9a621d72",
    "cold_start": "true",
    "message": "User created"
}
```

Future plans and thoughts:

-   Enhanced user model schema checking. Currently required values, and min/max length are enforced. Pattern matching could be added for more granular validation of dates, for instance.
-   Break out the CDK stack and Lambda code into modules
-   Better sanitize some errors generated by AWS resources (like Dynamo), so ARNs and other AWS specific information is not revealed to the client using the API
-   Tests for API endpoints and the AWS services created with the CDK
-   Process any data deposited in the Lamda DLQs
-   Use direct API Gateway service integrations to other AWS resources, bypassing Lambda, if it make sense.

## Install & Deploy

Ensure you have the AWS CLI installed and configured with your AWS credentials

-   Install: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
-   Configure: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

Install the AWS CDK

```
npm install -g aws-cdk
```

Clone the repository

```
git clone <this repository url>
```

Go to the repository's directory and install. This installs packages for the CDK stack and for the Lambda Layer.

```
cd <local repo directory>
npm install
```

NOTE: If this is your first time running the AWS CDK in this AWS account and/or region, you need to boostrap the CDK

```
cdk boostrap
```

Optional: Synthesize the stack to see the CloudFormation template the CDK generates

```
cdk synth
```

Deploy the stack (note the various options)

```
// Example #1: standard 'DEV' stack
cdk deploy

// Example #2: deploys to a stack named 'TEST'
cdk deploy -c stage=test

// Example #3: deploys to a stack named 'PROD' with using a specific AWS profile.
cdk deploy -c stage=prod --profile MY_PROFILE_NAME
```

After a few minutes the stack should respond with the API endpoint

```
// Example output (your endpoint URL will be different)

// NOTE: The endpoint will not have the trailing '/users' which you will need to add when interacting the api.

Outputs:
SF-UserStack-DEV.SFUserStackDEVUsersAPIEndpointC5532769 = https://epvz8ugbl7.execute-api.us-east-1.amazonaws.com/prod/
```

## Create a User

> Method: POST
>
> Endpoint: https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/prod/users/
>
> Returns: 200 and the system generated user id

```json
// Expected payload: all fields required, except 'description'

{
    "name": "Jane Smith",
    "dob": "YYYY-MM-DD",
    "address": {
        "street": "123 Main Street",
        "city": "Austin",
        "state": "TX",
        "zip": "78729-1234"
    },
    "description": "this is the description"
}
```

```json
// Return payload

{
    "id": "118bb552-cded-43be-bc90-74973320a780"
}
```

## Read a User

> Method: GET
>
> Endpoint: https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/prod/users/<USER_ID>
>
> Returns: 200 and a payload

```json
// Return payload

{
    "id": "5da9791d-dcfa-4a46-ba64-ad5a933426eb",
    "address": {
        "zip": "55466",
        "state": "MT",
        "city": "Billings",
        "street": "123 Main Street"
    },
    "description": "this is the description",
    "name": "Tim Williams",
    "dob": "1984-04-01"
}
```

## Update a User

> Method: PATCH
>
> Endpoint: https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/prod/users/<USER_ID>
>
> Returns: 204

```json
// Expected payload: This is an exammple updating 3 fields

{
    "name": "NEW NAME",
    "dob": "YYYY-MM-DD",
    "address": {
        "city": "NEW CITY"
    }
}
```

## Delete a User

> Method: DELETE
>
> Endpoint: https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/prod/users/<USER_ID>
>
> Returns: 204
