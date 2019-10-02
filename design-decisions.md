# Design Decisions
Assumptions, thoughts and decisions for current and future consideration.

##  Technologies and frameworks
- Typescript
- TSLint
- DynamoDb - The problems prefers it and it has good options for local development in a docker image or serverless plugin
- Documentation (github md's, api gateway, swagger) - TBD
- Serverless provisioning (serverless, AWS Sam, Terraform...) - I'd like to try out AWS Sam but I'm familiar with serverless so I'll choose it for this project
- Local dev environment - I would normally begin with a fully functioning local dev environment (serverless-offline, serverless-dynamodb-local) - This is going to take a little more time but I still think it's essential to start any real project this way.  I'll invest the extra time on this.
- serverless-dynamodb-local - We have other options with dynamodb-local through [docker](https://hub.docker.com/r/amazon/dynamodb-local) which I've used recently.  But I really wanted to evaluate this library. It unfortunately requires Java.  For me that's not a huge issue but something that could become an issue for larger teams.
- Validation - Try to handle with Json Shema and API Gateway.  See below for a more optimal long-term approach.  This may fit into that long-term approach.
- Testing (mocha, tsnode, jest) - I've used mocha combined with tsnode.  I'll likely follow that pattern but may evaluate other options as I go.  Also consider integration tests and further as time permits

## Future Considerations
- Error Handling - TBD
- Logging - TBD
- Monitoring - TBD
- Analytics - TBD
- Retries - TBD
- Caching or Edge deployment - TBD
- Build pipeline ( circle, code pipelines ) - This is normally something I would set up very early on in a project but I'll likely skip it as I don't think it's at the core of what the problem needs to demostrate
- Multi-stage - For now we will only support the default stage but it would be trivial to introduce multiple stages. (test, preprod, prod)
- HTTPS - Normally I'd start with HTTPS as long as we owned the certificate we wanted to use.  I'll likely skip this for this excercise rather than spend time procurring a certificate
- Lambda server framework - (aws-lambda, serverless-http) - The problem states each endpoint should be an AWS Lambda function.  I'll use pure lambdas with some extraction of common code for the API Gateway -> Lambda interaction
- Security ( JWT, un/pw, auth services, Gateway Authorizers ) - Obviously we would want some security around this service but the problem does not require it so I will skip it.
- Docs, Validation, Models source of truth - Optimally we would have one source of truth that could drive the 3 of these.  There are many approaches we could take.  Swagger, JsonSchema, API Gateway, Serverless, Code Generation, Typescript Schema Generators.  You could start with schema or models as your source of truth and have the others generated with custom generation or existing tooling and frameworks.  This is an instance where typescript and decorators can reduce a lot of overhead.  For this problem I don't feel there is enough time to get into this optimal solution.  Somethign to plan for in the future