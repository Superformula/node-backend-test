# Design Decisions
Assumptions, thoughts and decisions for current and future consideration.

##  Technologies and frameworks
- Typescript
- TSLint
- DynamoDb - The problem prefers it and it has good options for local development in a docker image or serverless plugin
- Documentation - Rely on github for now but it would be nice to have polished api documentation
- Serverless provisioning (serverless, AWS Sam, Terraform...) - I'd like to try out AWS Sam but I'm familiar with serverless so I'll choose it for this project
- Local dev environment - I would normally begin with a fully functioning local dev environment (serverless-offline, serverless-dynamodb-local) - This is going to take a little more time but I still think it's essential to start any real project this way.  I'll invest the extra time on this.
- serverless-dynamodb-local - We have other options with dynamodb-local through [docker](https://hub.docker.com/r/amazon/dynamodb-local) which I've used recently.  But I really wanted to evaluate this library. Unfortunately it requires Java.  For me that's not a huge issue but something that could become an issue for larger teams.

- Validation - Try to handle with Json Shema and API Gateway.  I was able to get validation working with API Gateway with a schema defined in serverless BUT there is an open issue in serverless-offline which means it will not work locally.  Thus I wasn't able to add tests for it.  See below for a more optimal long-term approach.  
- Testing (mocha, tsnode, jest) - I chose jest with ts-jest.  It worked well enough.  I ran into an issue where my unit tests really weren't going to offer much value but integration tests would. Integration tests working with all the local tooling to replicate the aws serverless environment with a single command would certainly be possible and optimal but was taking too much time.  For now I will run two commands to run tests :(

## Future Considerations
- Logging - I'm using pino which I've used before.  It's fast and defaults to json which works well with cloudwatch and other logging aggregators.  We can enhance logging to record information about each request.  We could then combine logging with cloudwatch to cheaply get some traction on a few items below (monitoring and analytics).
- Monitoring - We would want to introduce monitoring and alarms for latency, call volume, errors etc
- Security - I have used AWS WAF to protect against DDoS, general bots, throttling, etc in the past.
- Analytics - This may or may not be important.  Something to consider while evaluating the needs of the client
- Caching or Edge deployment - API Gateway offers an edge option as does dynamodb and lambda.  We could take this path if needed
- Lambda cold starts - This could be a problem if latency is a concern.  There are some modules which can attempt to keep your lambdas warm.  There are also other approaches such as a single lambda for your entire api.  It just depends on your needs.
- Build pipeline ( circle, code pipelines ) - This is normally something I would set up very early on in a project but I'll likely skip it as I don't think it's at the core of what the problem needs to demostrate
- Multi-stage - For now we will only support the default stage but it would be trivial to introduce multiple stages. (test, preprod, prod)
- HTTPS - Normally I'd start with HTTPS as long as we owned the certificate we wanted to use.  I'll likely skip this for this excercise rather than spend time procurring a certificate
- Lambda server framework - (aws-lambda, serverless-http) - The problem states each endpoint should be an AWS Lambda function.  I'll use pure lambdas with some extraction of common code for the API Gateway -> Lambda interaction
- Authentication/Authorization ( JWT, un/pw, auth services, Gateway Authorizers ) - Obviously we would want some security around this service but the problem does not require it so I will skip it.
- Docs, Validation, Models - Optimally we would have one source of truth that could drive the 3 of these.  There are many approaches we could take.  Swagger, JsonSchema, API Gateway, Serverless, Code Generation, Typescript Schema Generators.  You could start with schema or models as your source of truth and have the others generated with custom generation or existing tooling and frameworks.  This is an instance where typescript and decorators can reduce a lot of overhead.  For this problem I don't feel there is enough time to get into an  optimal solution.  Something to plan for in the future