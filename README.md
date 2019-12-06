# Superformula Back-end Developer Solution

Solution to Cloud-native using Serverless framework and Node.js to create a RESTful API for a user object with a filter by name API.

## Deployment to AWS
Ensure you have a default AWS credentials in your .aws/credentials folder and issue the following command to deploy into the us-east-1 region:
```
serverless deploy
```
## Unit Testing
To run the unit test suite and see code coverage issue this command:
```
npm test
```
## Integration Testing
To run an integration test, you can invoke each api (`create/read/update/delete/filter`) with the following:
```
serverless invoke local --function <api> --path mocks\<api>-user.json
```
## Documentation Generation
To generate the OpenAPI specification documentation issue this command:
```
serverless openapi generate
```
A openapi.yml file will be present in the folder, you can copy that contents into https://editor.swagger.io/ and view a very simple documentation.  This can also be hosted out of the repo, but for the sake of the assignment I thought it easiest to just make use of this editor.

## Written Answers

### Lambda Error Handling, Retries and DLQs

When Lambda is triggered synchronously via API Gateway, there isn't AFAIK an automatic way to have the error recorded into a DLQ.  This puts the responsibility of retries on the front end application that is interacting with the API Gateway endpoint.  The approach I took in these APIs was to give clear and concise HTTP error codes to indicate whether or not a request should/could be retried.  If we were invoking Lambda in an asynchronous fashion, it would have a lot more options for retry configuration like a DLQ in SQS.

I hope this is a satisfactory answer, if we were talking about a workflow that is kicked off asynchronously there would be more to discuss about this strategy.

### Logging, Monitoring and alarming

Throughout the API I have made use of the console for logging, using info/error/warn where appropriate.  These logs will naturally flow into CloudWatch with the corresponding log group for each API and stage it is in (prod/dev).  Using metric filters we can pattern match and emit a value that would be alarmable with a CloudWatch alarm.  I would use a low sev/high sev pair, where a low sev may not require action but is noted that there is a potential issue and a high sev indicating that action is required immediately.  All cloud watch alarms can be modeled in IaC in the serverless.yml resource files.  This keeps any manual setup to a minimum for a developer.

Since we are using managed services, each service like Lambda/API Gateway/DynamoDB already emit their own sets of metrics that can be alarmed on.  This requires fare less augmentation of the code to emit your own metrics.

### Filter Feature

I implemented a basic query on the name of the user, provided a query parameter with "name" is present in the request.  I wanted to call out a few things about this solution, given DynamoDB is naturally a key/value store and any query or table scan operations are expensive it is paramount when building a feature like this to understand the exact types of read queries the application must respond to.  Without clarity here, operations could be very expensive ($) and correct LSI or GSI need to be available to support these.  Also, if multiple attributes were to be queried for, a composite key of concatenated attributes is a great solution to build an index off of.  The last thing I wanted to mention about the method of implementation is that I chose query parameters for bookmarkability, if I were to have included it as a POST with a body, we would not have that functionality which can be great for front end applications.
