# Superformula Back-end Developer Test

Be sure to read **all** of this document carefully, and follow the guidelines within.

## Context

Build a RESTful API that can `create/read/update/delete` user data from a persistence store.

### User Model

```
{
  "id": "xxx",                  // user ID (must be unique)
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "UpdatedAt": ""               // user updated date
}
```

## Requirements

### Functionality

- The API should follow typical RESTful API design pattern.
- The data should be saved in the DB.
- Provide proper API documentation.
- Proper error handling should be used.

### Tech stack

- Use Node.js `LTS` and any framework of your choice.
- Use any persistence store. NoSQL DB is preferred.

### Bonus

- Write clear **documentation** on how it has been designed and how to run the code.
- Provide proper unit tests.
- Add a read only endpoint to fetch location information based off the user's address (use [NASA](https://api.nasa.gov/api.html) or [Mapbox](https://www.mapbox.com/api-documentation/) APIs)
- Use Docker containers.
- Utilize Docker Compose.
- Setup a CircleCI config to build/test/deploy the service.
- Write concise and clear commit messages.
- Leverage Terraform or other infrastructure management tooling to spin up needed resources.
- Providing an online demo is welcomed, but not required.

### Advanced requirements

These may be used for further challenges. You can freely skip these if you are not asked to do them; feel free to try out if you feel up to it.

- Use [hapi](https://hapijs.com/) to build the core feature and use a different framework (such as Express or Loopback) to handle HTTP requests.
- Provide a complete user auth (authentication/authorization/etc) strategy, such as OAuth.
- Provide a complete error handling and logging (when/how/etc) strategy.
- Use a NoSQL DB and build a filter feature that can filter records with some of the attributes such as username. Do not use query languages such as MongoDB Query or Couchbase N1QL.

## What We Care About

Use any libraries that you would normally use if this were a real production App. Please note: we're interested in your code & the way you solve the problem, not how well you can use a particular library or feature.

_We're interested in your method and how you approach the problem just as much as we're interested in the end result._

Here's what you should strive for:

- Good use of current Node.js & API design best practices.
- Solid testing approach.
- Extensible code.

## Q&A

> Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think you are done. There is no deadline for this task unless otherwise noted to you directly.

> What if I have a question?

Just create a new issue in this repo and we will respond and get back to you quickly.
