/**
 * User Plugin
 * @description defines the routes available on the users resource
 * @type {Hapi Plugin Object}
 */
const joi                  = require('joi')
const generateUUID         = require('uuid/v1')
const userValidationSchema = require('./user-model')
const pickProperties       = require('lodash/pick')

module.exports = {
  name: 'userService',
  version: '1.0.0',
  async register(server, options) {

    /**
     * @param  {name}
     * @return {Object: User} New user object
     */
    server.route({
      method:'POST',
      path:'/',
      options: {
        validate: {
          payload: pickProperties(userValidationSchema, ['name', 'dob', 'address', 'description'])
        }
      },
      handler(request, h) {
        // add system generated properties
        const systemGeneratedProperties = { 
          id: generateUUID(), 
          createdAt: new Date().toISOString(),
        }

        // assure updatedAt is exactly the same as createdAt at this point.
        systemGeneratedProperties.updatedAt = systemGeneratedProperties.createdAt

        const newUser = Object.assign(request.payload, systemGeneratedProperties)

        
        return newUser
      }
    })

    // GET users
    server.route({
      method:'GET',
      path:'/',
      handler(request, h) {
        return 'GET Users'
      }
    })

    // GET user by id
    server.route({
      method:'GET',
      path:'/{userId}',
      handler(request, h) {
        return 'GET User ' + encodeURIComponent(request.params.userId)
      }
    })

    // PUT user
    server.route({
      method:'PUT',
      path:'/{userId}',
      handler(request, h) {
        return 'Create User' + JSON.stringify(request.payload)
      }
    })

    // DELETE user
    server.route({
      method:'DELETE',
      path:'/{userId}',
      handler(request, h) {
        return 'Create User' + JSON.stringify(request.payload)
      }
    })
  }
}
