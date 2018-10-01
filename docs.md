# README
---

Users API exposes the ability to view and manage users.

Swagger UI available at `/documentation` endpoint.

## API

### Actions
##### CREATE USER
POST /api/v1/users/

Response Type: Single Entity (User)

This endpoint allows creation of a new user record. 

The `id` property can be optionally provided when creating a user. If not provided, a uuid will be generated. If provided in the request, it will be subject to uniqueness across all users. A `409` status code is returned if the `id` already exists.

##### LIST USERS
GET /api/v1/users/

Response Type: Collection (Users)

Lists all available users. Pagination is supported via `limit` and `page` properties in the query params.

##### UPDATE USER
PUT /api/v1/users/{userId}

Response Type: Single Entity (User)

`userId` must be the `id` property of an existing user.

Read-only properties such as `id`, `createdAt`, and `updatedAt` cannot be modified and cannot be provided in the request body.

This endpoint allows for replacing of the existing user record with the one provided. This means that any ommitted properties will be deleted from the record.

##### DELETE USER
DELETE /api/v1/users/{userId}

Response Type: Single Entity (User)

Will return 200 if the `userId` is found and deleted or if the `userId` does not exist.

### Standards 

#### Responses
##### Success
A successful response may be of three varieties: empty, single entity, or collection.

###### Empty
An empty response will contain no discernable body or headers. Only the HTTP status code is meaningful in this response type

###### Single Entity
When responding with a single entity, the response will contain a `type` and an `item` property. This is the most common type of response in the Users API.

Example response
```json
{
  "type": "User",
  "item": {
    "id": "9989b070-c4f5-11e8-8936-7bcfecbaf8e6",        
    "name": "Jack O'niell",                              
    "dob": "1989-10-01T00:00:00.000Z",
    "description": "Jack has served on SG-1 10+ years.", 
    "createdAt": "2018-10-01T03:52:47.093Z",
    "updatedAt": "2018-10-01T04:19:16.068Z",
  }
}
```

###### Collection
The collection response type contains `type` and `items` properties. The `type` property is always in plural form for this response type. The `items` property is an array of objects, each of which can be thought of as a single instance of a single entity response.

Example response:
```json
{
  "type": "Users",
  "items": [
    {
      "id": "9989b070-c4f5-11e8-8936-7bcfecbaf8e6",        
      "name": "Jack O'niell",                              
      "dob": "1989-10-01T00:00:00.000Z",
      "description": "Jack has served on SG-1 10+ years.", 
      "createdAt": "2018-10-01T03:52:47.093Z",
      "updatedAt": "2018-10-01T04:19:16.068Z",
    }
  ]
}
```

##### Unsuccessful
All unsuccessful responses will follow the [`boom`](https://github.com/hapijs/boom) base model:

```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "invalid query"
}
```

#### User Model

Anytime a user record is provided, it will use the user object model noted in the snippet below.

```js
{
  "id": "9989b070-c4f5-11e8-8936-7bcfecbaf8e6",         // Must be a valid UUID
  "name": "Jack O'niell",                               // Limited to 64 characters
  "dob": "1989-10-01T00:00:00.000Z",
  "description": "Jack has served on SG-1 10+ years.",  // Limited to 250 characters
  "createdAt": "2018-10-01T03:52:47.093Z",
  "updatedAt": "2018-10-01T04:19:16.068Z",
}
```

- All date fields must be in UTC timezone and ISO 8601 date format.
- `createdAt` and `updatedAt` are API-controlled read-only properties.
- Optional properties are conditionally present
    - For example, if a user record does not provide a `description` when creating or updating, it will not be removed from the record entirely.

## Design

Access
  Authentication
  Authorization
    list all users
Hapi Server
  - RESTful
    - no PATCH or LIST. simpler behaviors
      - has danger of being misused if there are single-property consuming downstream services for PUT.
    - all routes should add swagger reqs
  - Error handling
  - infrastructural app integrity
    - cutoff long responses with 50x
  - Responses
    - standard error resp (Boom)
    - standard success responses
Datastore
  - Mongo
    - indexes
Testing
Runtime
  - Docker
  - Logging
    - log level guidance
      - typical info, warn, error, debug, etc. 
      - don't log errors that are handled cases
    - request logging vs. error logging
    - log aggregation and insights strategy
      - everything to stdout and aggregated by runtime process
      - removes burden from app; can have a centralized logging library and collection process
      - smoother transition to cloud-native solutions such as FaaS

## Developer Guide

### First Time Setup
To setup the app on your local development machine the first time:

1. Clone the repo locally and navigate into the root directory of the project.
2. Run `npm install`

### Running the app

With Docker:

Without Docker:

### Contribution Guidelines


## Code Test Notes
Design
  - eventual consitency
    - would not have immediately consistent responses; would respond with 202s and no body instead

User Model:
  - source.
  - Typically, I'd ask if this service is a core, unoppinionated CRUD service or whether there are additional business requirements that are always applicable to it such as `name` or `dob` being required.  
  - I've made `id` property an internal, system-generated guid to keep this API strict with private data ownership. Would be helpful to add an external system reference id as well. 
    - Can be as simple as a naive `source_system_reference_id` property
  - Sometimes UIs need to conditionally display name in different places with composite pieces (A. Tariq, Afaq Tariq, Mr. Tariq, etc.). If the usecase for this APIs was a myriad of UIs, consider if there is a need for splittting `name` property into more explicit properties such as first name, last name, title, etc.
  - `address` property should be updated to be an object with standard properties (address, state, zip, etc.) if possible.