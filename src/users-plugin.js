/**
 * User Plugin
 * @description defines the routes available on the users resource
 * @type {Hapi Plugin Object}
 */
module.exports = {
  name: 'userService',
  version: '1.0.0',
  async register(server, options) {

    // GET users
    server.route({
      method:'GET',
      path:'/',
      handler(request, h) {
        return 'GET Users'
      }
    })

    // POST user
    server.route({
      method:'POST',
      path:'/',
      handler(request, h) {
        return 'Create User' + JSON.stringify(request.payload)
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
