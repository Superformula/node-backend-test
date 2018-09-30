/**
 * User Plugin
 * @description defines the routes available on the users resource
 * @type {Hapi Plugin Object}
 */
const joi                  = require('joi')
const userValidationSchema = require('./user-model')
const pickProperties       = require('lodash/pick')
const addNewUserHandler    = require('./route-handlers/create-new-user')

module.exports = {
  name: 'userService',
  version: '1.0.0',
  async register(server, options) {

    server.route({
      method:'POST',
      path:'/',
      options: {
        validate: {
          payload: pickProperties(userValidationSchema, ['name', 'dob', 'address', 'description'])
        }
      },
      handler: addNewUserHandler,
    })

    // GET users
    server.route({
      method:'GET',
      path:'/',
      handler(request, responseHandler) {
        return 'GET Users'
      }
    })

    // GET user by id
    server.route({
      method:'GET',
      path:'/{userId}',
      handler(request, responseHandler) {
        return 'GET User ' + encodeURIComponent(request.params.userId)
      }
    })

    // PUT user
    server.route({
      method:'PUT',
      path:'/{userId}',
      handler(request, responseHandler) {
        return 'Create User' + JSON.stringify(request.payload)
      }
    })

    // DELETE user
    server.route({
      method:'DELETE',
      path:'/{userId}',
      handler(request, responseHandler) {
        return 'Create User' + JSON.stringify(request.payload)
      }
    })
  }
}
