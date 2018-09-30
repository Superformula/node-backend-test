/**
 * @description Entrypoint of this API
 */
const Hapi              = require('hapi')
const server            = Hapi.server({ 
  host: process.env.USERS_API_HOST, 
  port: process.env.USERS_API_PORT
})
const userServicePlugin = require('./users-plugin/')

/**
 * @description Handles injecting routes and starting the server and any initial failure logging
 * @return undefined
 */
async function startApi() {
  try {
    // register the user resource plugin
    await server.register(userServicePlugin, {
      routes: {
        prefix: '/api/v1/users'
      }
    })

    await server.start()
  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

startApi()