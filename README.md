# User's API
Provides endpoints to Create/Read/Update/Delete users.  See the detailed [instructions](problem-description.md)

## Development Setup (ONE TIME)

### Prerequisites
- Node 10+
- NPM
- Yarn
- Git
- GitBash
- Java Runtime Engine (JRE) version 6.x or newer.  This is a requirement of `serverless-dynamodb-local`.  

### Install serverless with binary extensions
`npm -g install serverless`

### Install packages
`yarn`

### Setup dynamodb-local
`sls dynamodb install`

## Run locally

### Start local service
- `yarn start` 

### Expore
- Verify: `curl localhost:3000/users/1`
- Hack/inspect dynamodb-local: http://localhost:8000/shell/#