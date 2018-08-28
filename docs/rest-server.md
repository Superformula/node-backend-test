Database Model + Attributes
Example:
### MODEL NAME
* Attribute Name: data type & (additional information)

### USER
* id: Auto-Generated
* name: String & Cannot be null
* dob: String & Cannot be null
* address: String & Cannot be null
* description: String & Cannot be null
* createdAt: Auto-Generated
* updatedAt: Auto-Generated

API Routes + Responses

List of all API endpoints and what to expect:

'/user'
* GET: response - { result : obj }
  - SUCCESS: returns array of User objects
  - FAILURE: returns 400 status code with error message
* POST: accepts - { name, dob, address, description } | response - { result : obj }
  - SUCCESS: returns status code 201 and created User obj
  - FAILURE: returns 400 status code with error message

'/user/:id'
PARAM: USER ID
* GET: response - { result: obj }
  - SUCCESS: returns single User obj
  - FAILURE: returns 400 status code with error message
* PUT: accepts - { name, dob, address, description } | response - { result: obj }
  - SUCCESS: returns status code 200
  - FAILURE: returns 400 status code with error message
* DELETE: response - { result: obj }
  - SUCCESS: returns status code 200
  - FAILURE: returns 400 status code with error message

'/mapbox/:id'
PARAM: USER ID
REQUIRES: API KEY
* GET: response - { result: obj }
  - SUCCESS: returns obj with user latitude & longitude properties
  - FAILURE: returns 400 status code with error message