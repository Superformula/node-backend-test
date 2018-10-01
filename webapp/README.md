
## Overview

This folder contains a JSON REST API designed as a response to the Superformula Node.js backend developer test. The API provides expected CRUD endpoints and conforms to the [JSON API Specification](http://jsonapi.org) in its structure and response formats. Currently there is no authentication required to access the API.

The application expects Node.js LTS and is primarily built using the [Express](http://www.expressjs.com) module for HTTP request/response and the [Mongoose ODM](https://mongoosejs.com/) module for persistence via MongoDB. In order to structure and organize the application, an HMVC approach is taken to building out the Express implementation. The individual modules of the HMVC structure are named "app modules" and can be found in the `app_modules` subfolder. Each app module contains submodules for routes, middleware handlers and models, each of which are loaded by the Express application during the bootstrap process. Additional modules are placed in a `services` subfolder and are designed as an abstraction for common tasks and vendor-specific implementations, such as querying the database (i.e. `servivecs/nosql.js`) or ensuring consistent response formats to API requests (i.e. `services/restApi.js`).

This approach creates extensibility by logically organizing endpoints. For example, all `/api/users` endpoints are handled by the `user` app module, and new endpoint groups and functionality can be added by adding new app modules. Additionally, there is an `api` app module which provides uptime endpoints and could easily be expanded to include authentication, rate limiting and other system-wide features. Service modules can access app modules in a predictable way and create a single, consistent method for their own consumption.

## Installation

Start by installing application dependencies using NPM:

````bash
$ npm i
````

The application is designed to use [PM2](http://pm2.keymetrics.io/) in development for watching and hot-reloading. PM2 is not listed as a development dependency, and it is instead *highly* recommended that you install it globally in your development environment:

````bash
$ npm i -g pm2
````

Next, create a local PM2 configuration file using the provided default file:

````bash
$ cp pm2.json pm2.local.json
````

Ensure that configuration values in `pm2.local.json` will work with you system, and then start the application:

````bash
$ pm2 start pm2.local.json
````

You should now have the application running, with all revelant JS files being watched.


## API Endpoints

All API endpoint paths exposed by the application begin with the prefix `/api`, which is a simple namespacing of paths in the event that additional functionality outside the current scope of the API is added at a later point. All endpoints which accept a request body are expecting a JSON format, and all response bodies use JSON as well. No other data formats are currently supported.

#### GET /users/:userId

Retrieve a single user object from the database using their unique Id.

##### Response data

| Property | Description |
| :--------|:------------|
| id | Unique numerical Id |
| name      | Full name (first and last) |
| dob      | Date of birth in the format `YYYY-MM-DD` |
| address | Full street address |
| description | A brief but poignant characterization |
| createdAt | Datetime when the user object was created |
| updatedAt | Datetime when the user object was last changed |

##### Example

````
## Request

GET http://localhost:3000/api/users/1

## Response

{
    "data": {
      "name": "Billy Shakespeare",
      "dob": "1564-04-23",
      "address": "110 N Alpine Dr, Beverly Hills, California 90210",
      "description": "Loves plays, hates rectangles.",
      "createdAt": "2018-09-30T23:51:09.727Z",
      "updatedAt": "2018-09-30T23:51:09.727Z",
      "id": 1
    },
    "links": {
      "self": "http://localhost:3000/api/users/1"
    }
}
````

##### Response Codes

* 200: The user was successfully retrieved
* 404: A user with the given Id was not found
* 400: Internal server error

#### GET /users

Retrieve a paginated list of user objects.

##### Query parameters

| Parameter | Description |
| :--------|:------------|
| limit | The number of objects to return. Max is 100. |
| offset      | The number of objects to skip before beginning to return results (i.e. offset) |

##### Example

````
## Request

GET http://localhost:3000/api/users?limit=3&offset=0

## Response

{
    "data": [
        {
          "name": "Billy Shakespeare",
          "dob": "1564-04-23",
          "address": "110 N Alpine Dr, Beverly Hills, California 90210",
          "description": "Loves plays, hates rectangles.",
          "createdAt": "2018-09-30T23:51:09.727Z",
          "updatedAt": "2018-09-30T23:51:09.727Z",
          "id": 1
        },
        {
          "name": "William James Adams Jr.",
          "dob": "1975-03-15",
          "address": "112 N Alpine Dr, Beverly Hills, California 90210",
          "description": "Great voice",
          "createdAt": "2018-09-30T23:51:09.727Z",
          "updatedAt": "2018-09-30T23:51:09.727Z",
          "id": 2
        },
        {
          "name": "Sir William Wallace",
          "dob": "1297-01-01",
          "address": "114 N Alpine Dr, Beverly Hills, California 90210",
          "description": "Loves freedom",
          "createdAt": "2018-09-30T23:51:09.727Z",
          "updatedAt": "2018-09-30T23:51:09.727Z",
          "id": 3
        }
    ],
    "links": {
      "self": "http://localhost:3000/api/users?limit=3&offset=0",
      "first": "http://localhost:3000/api/users?offset=0&limit=3",
      "last": "http://localhost:3000/api/users?offset=23&limit=3",
      "next": "http://localhost:3000/api/users?offset=3&limit=3"
    }
}
````

##### Response Codes

* 200: The page of users was successfully retrieved
* 400: Internal server error

#### POST /users

Create a new user object. 

##### Request data

Please see the above documentation for GET /users/:userId for a description of the fields.

| Field name | Required |
| :--------|:------------|
| name      | Yes |
| dob      | No |
| address | No |
| description | No |

##### Example

````
## Request

POST http://localhost:3000/api/users

{
  "name": "J. Wilkes Boothe",
  "dob": "1838-05-10",
  "address": "50 Hazelwood Ln, Port Royal, Virginia 22535",
  "description": "Seems a little jumpy"
}

## Response

{
    "data": {
      "name": "J. Wilkes Boothe",
      "dob": "1838-05-10",
      "address": "50 Hazelwood Ln, Port Royal, Virginia 22535",
      "description": "Seems a little jumpy",
      "createdAt": "2018-09-30T23:51:09.727Z",
      "updatedAt": "2018-09-30T23:51:09.727Z",
      "id": 4      
    },
    "links": {
      "self": "http://localhost:3000/api/users/4"
    }
}
````

##### Response Codes

* 201: The new user was successfully created
* 400: The new user data did not pass validation and a new user was not created

#### PATCH /users/:userId

Patch a single user object using their unique Id. Please see the above documentation for POST /users for a list of available request data. Full updating is not currently supported.

##### Example

````
## Request

PATCH http://localhost:3000/api/users/2

{
  "description": "Always wears an interesting t-shirt"
}

## Response
{
    "data": {
      "name": "William James Adams Jr.",
      "dob": "1975-03-15",
      "address": "112 N Alpine Dr, Beverly Hills, California 90210",
      "description": "Always wears an interesting t-shirt",
      "createdAt": "2018-09-30T23:51:09.727Z",
      "updatedAt": "2018-09-30T23:51:09.727Z",
      "id": 2
    },
    "links": {
      "self": "http://localhost:3000/api/users/2"
    }    
}
````

##### Response Codes

* 204: The user was successfully patched
* 400: The user data did not pass validation and a patch was not performed
* 404: A user with the given Id was not found

#### DELETE /users/:userId

Permanently hard-delete a single user object using their unique Id.

##### Example

````
## Request

DELETE http://localhost:3000/api/users/2

````

##### Response Codes

* 204: The user was successfully deleted
* 404: A user with the given Id was not found