# README
---

Users API exposes the ability to view and manage users.

## Developer Guide

### First Time Setup
To setup the app on your local development machine the first time:

1. Clone the repo locally and navigate into the root directory of the project.
2. 

### Running the app

With Docker:

Without Docker:


## Code Test Notes

User Model:
  - Typically, I'd ask if this service is a core, unoppinionated CRUD service or whether there are additional business requirements that are always applicable to it such as `name` or `dob` being required.  
  - I've made `id` property an internal, system-generated guid to keep this API strict with private data ownership. Would be helpful to add an external system reference id as well. 
    - Can be as simple as a naive `source_system_reference_id` property
  - Sometimes UIs need to conditionally display name in different places with composite pieces (A. Tariq, Afaq Tariq, Mr. Tariq, etc.). If the usecase for this APIs was a myriad of UIs, consider if there is a need for splittting `name` property into more explicit properties such as first name, last name, title, etc.
  - `address` property should be updated to be an object with standard properties (address, state, zip, etc.) if possible.