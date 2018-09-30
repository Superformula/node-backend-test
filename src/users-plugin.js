/**
 * User Plugin
 * @description defines the routes available on the users resource
 * @type {Hapi Plugin Object}
 */
const joi       = require('joi')
const userModel = require('./user-model')

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
          payload: {
            name: joi.string().min(1).max(100).required()
          }
        }
      },
      handler(request, h) {
        // add guid
        // add timestamps
        // return new user
        return request.payload
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
