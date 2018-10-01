# README
---

Users API exposes the ability to view and manage users.

## API

## Design

Access
  Authentication
  Authorization
Hapi Server
  - RESTful
    - no PATCH or LIST. simpler behaviors
      - has danger of being misused if there are single-property consuming downstream services for PUT.
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
  - Typically, I'd ask if this service is a core, unoppinionated CRUD service or whether there are additional business requirements that are always applicable to it such as `name` or `dob` being required.  
  - I've made `id` property an internal, system-generated guid to keep this API strict with private data ownership. Would be helpful to add an external system reference id as well. 
    - Can be as simple as a naive `source_system_reference_id` property
  - Sometimes UIs need to conditionally display name in different places with composite pieces (A. Tariq, Afaq Tariq, Mr. Tariq, etc.). If the usecase for this APIs was a myriad of UIs, consider if there is a need for splittting `name` property into more explicit properties such as first name, last name, title, etc.
  - `address` property should be updated to be an object with standard properties (address, state, zip, etc.) if possible.