/**
 * @description Entrypoint of this API
 */
const hapi              = require('hapi')
const userServicePlugin = require('./users-plugin')
const loggingPlugin     = require('./logging-plugin')
const hapiMongodbPlugin = require('hapi-mongodb')
const hapiSwaggerPlugin = require('hapi-swagger')
const inert             = require('inert')
const vision            = require('vision')
const usersApi          = hapi.server({ 
  host: process.env.SUPF_USERS_API_HOST, 
  port: process.env.SUPF_USERS_API_PORT
})
const mongoDbPluginOptions = {
  url: `mongodb://${process.env.SUPF_USERS_MONGODB_HOST}:${process.env.SUPF_USERS_MONGODB_PORT}/${process.env.SUPF_USERS_MONGODB_NAME}`,
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
    
    // register swagger plugin
    await usersApi.register([
      inert,
      vision,
      {
        plugin: hapiSwaggerPlugin,
        options: {
          basePath: '/api/v1',
          info: {
            title: 'Superformula Users API'
          }
        }
      }
    ])

    // register the mongodb plugin
    await usersApi.register({
      plugin: hapiMongodbPlugin,
      options: mongoDbPluginOptions
    })

    // register the user resource plugin
    await usersApi.register(userServicePlugin, {
      routes: {
        prefix: '/api/v1/users',
      }
    })

    const mongoUserCollection = usersApi.mongo.db.collection('users')
    usersApi.method('getUserById', userId => mongoUserCollection.findOne({ _id: userId, archived: false }))
    usersApi.method('insertUser', newUser => mongoUserCollection.insertOne(newUser))
    usersApi.method('updateUser', (userId, user) => mongoUserCollection.updateOne({ _id: userId }, user))
    usersApi.method('getAllUsers', (limit, skip) => {
      return mongoUserCollection.find({ archived: false }, { name: true, id: true, updatedAt: true })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()
    })

    await usersApi.start()

    usersApi.log(['info'], `Users Api started, ${usersApi.info.host}:${usersApi.info.port}`)
  }
  catch (startupError) {
    usersApi.log(['error'], `Users API could not startup on ${usersApi.info.uri}`)
    usersApi.log(['error'], startupError)
    process.exit(1)
  }
}

startApi()