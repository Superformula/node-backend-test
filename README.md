# User's API
Provides endpoints to Create/Read/Update/Delete users.  
- [Problem instructions](problem-description.md)  
- [Design decisions](design-decisions.md)
***
## Development Setup (ONE TIME)

### Prerequisites
- Node 10+
- NPM
- Yarn
- Git
- Java Runtime Engine (JRE) version 6.x or newer.  This is a requirement of `serverless-dynamodb-local`.  
- Curl (optional for testing)
- AWS account and keys configured (if you would like to deploy the service to AWS)

### Install serverless with binary extensions
`npm -g install serverless`

### Install packages
`yarn`

### Setup dynamodb-local
`sls dynamodb install`
***
## Run tests
`yarn start` ctrl-c to stop  
`yarn test`
> For now we have to start our local service and then run the test.  This is obviously not ideal and there are several ways to fix this going forward.
***
## Run locally

### Start local service
`yarn start` 
> Service available at http://localhost:3000


### Create a user
Path: `/users`  
Method: `POST`
Body: [schema](src/schema/userCreate.json)  
Example:
```
curl -X POST -d '{"address": "123 Main","name": "backend test", "dob": 1570497497, "description":"Described"}' -H "Content-Type: application/json" localhost:3000/users
```
### Get the user
Path: `/users/{id}`  
Method: `GET`  
Parameters: id  
Example:
```
curl localhost:3000/users/{userid}
```
### Update the user
Path: `/users/{id}`  
Method: `PUT`  
Parameters: id  
Body: [schema](src/schema/userUpdate.json)  
Example:
```
curl -X PUT -d '{"name": "updated name"}' -H "Content-Type: application/json" localhost:3000/users/{userid}
```

### Delete the user
Path: `/users/{id}`  
Method: `DELETE`  
Parameters: id  
Example:
```
curl -X DELETE localhost:3000/users/{createdUserid}
```
***
## Explore the database
http://localhost:8000/shell/#

***
## Deploy to aws
`sls deploy`

***
## Hosted version
URLs
```
GET - https://mumv8tvcx7.execute-api.us-east-1.amazonaws.com/dev/users/{id}  
POST - https://mumv8tvcx7.execute-api.us-east-1.amazonaws.com/dev/users  
PUT - https://mumv8tvcx7.execute-api.us-east-1.amazonaws.com/dev/users/{id}  
DELETE - https://mumv8tvcx7.execute-api.us-east-1.amazonaws.com/dev/users/{id}  
```

