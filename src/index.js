/**
 * @description Entrypoint of this API
 */
const hapi              = require('hapi')
const userServicePlugin = require('./users-plugin')
const loggingPlugin     = require('./logging-plugin')
const hapiMongodbPlugin = require('hapi-mongodb')
const usersApi          = hapi.server({ 
  host: process.env.USERS_API_HOST, 
  port: process.env.USERS_API_PORT
})
const mongoDbPluginOptions = {
  url: `mongodb://${process.env.USERS_MONGODB_HOST}:${process.env.USERS_MONGODB_PORT}/${process.env.USERS_MONGODB_NAME}`,
  settings: {
    poolSize: 10
  },
  decorate: true
}

/**
 * @description Handles injecting routes and starting the server and any initial failure logging
 * @return undefined
 */
async function startApi() {
  try {
    // register logging plugin and config
    await usersApi.register(loggingPlugin)

    // register the mongodb plugin
    await usersApi.register({
      plugin: hapiMongodbPlugin,
      options: mongoDbPluginOptions
    })

    // register the user resource plugin
    await usersApi.register(userServicePlugin, {
      routes: {
        prefix: '/api/v1/users'
      }
    })

    await usersApi.start()

    usersApi.log('info', `Users Api started, ${usersApi.info.host}:${usersApi.info.port}`)
  }
  catch (startupError) {
    usersApi.log('error', `Users API could not startup on ${usersApi.info.uri}`)
    process.exit(1)
  }
}

startApi()