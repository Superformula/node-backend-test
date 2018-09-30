# Developer Notes
---

User Model
  - `address` property should be updated to be an object with standard properties (address, state, zip, etc.) if possible.
  - I've made `id` property an internal, system-generated guid to keep this API strict with private data ownership. Would be helpful to add an external system reference id as well. 
    - Can be as simple as a naive `source_system_reference_id` property