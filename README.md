# User's API
Provides endpoints to Create/Read/Update/Delete users.  See the detailed [instructions](problem-description.md)

## Development Setup (ONE TIME)

### Prerequisites
- Node 10+
- NPM
- Yarn
- Git
- Java Runtime Engine (JRE) version 6.x or newer.  This is a requirement of `serverless-dynamodb-local`.  
- Curl (optional for testing)

### Install serverless with binary extensions
`npm -g install serverless`

### Install packages
`yarn`

### Setup dynamodb-local
`sls dynamodb install`

## Run locally

### Start local service
`yarn start` 


### Create a user
```
curl -X POST -d '{"address":"123 Main","name":"backend test","dob":"2001-10-02T02:52:57.240Z","description":"Described"}' -H "Content-Type: application/json" localhost:3000/users
```
### Get the user
```
curl localhost:3000/users/d606838c-73ef-4e50-b589-81d4aa67d2f9
```
### Update the user
```
curl -X PUT -d '{"name": "updated name"}' -H "Content-Type: application/json" localhost:3000/users/d606838c-73ef-4e50-b589-81d4aa67d2f9
```

### Delete the user
```
curl -X DELETE localhost:3000/users/d606838c-73ef-4e50-b589-81d4aa67d2f9
```
### Explore the database
http://localhost:8000/shell/#