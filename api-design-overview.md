# SuperFormula Back End design test

## Environment

- AWS Cloud Native
- API Gateway per-route entry points
- CRUD routes trigger Lambdas
- DynamoDB storage
- DLQ for catching errors
- Infrastructure as configuration/code

## Questions

1. Do we need to secure the API? (API key, lambda authorizer, something else?)

2. Should the API generate the unique user ID?  Or does the user request the User ID, and the API determines it's uniqueness?

3. Do we want to store the data exactly as shown in the model?  (i.e. address as a simple string).  Or do we want to break address into an object with attributes like street, city, state, zip, etc?

```json
{
  "id": "xxx",                  // user ID (must be unique)
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": "",              // user created date
  "updatedAt": ""               // user updated date
}
```