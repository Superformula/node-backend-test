/**
 * @description Entrypoint of this API
 */
const Hapi   = require('hapi')
const server = Hapi.server({ 
  host: process.env.USERS_API_HOST || 'localhost', 
  port: process.env.USERS_API_PORT || '8081'
})
const userServicePlugin = require('./users-plugin')

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
    
    console.log(`superformula-users-api started on ${process.env.USERS_API_HOST}:${process.env.USERS_API_PORT}`)
  }
  catch (err) {
    console.log(err)
    console.log('Users API Server could not startup:', server.info.uri)
    process.exit(1)
  }

}

startApi()