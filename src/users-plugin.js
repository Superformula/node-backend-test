/**
 * User Plugin
 * @description defines the routes available on the users resource
 * @type {Hapi Plugin Object}
 */
const joi                   = require('joi')
const userValidationSchema  = require('./user-model')
const pickProperties        = require('lodash/pick')
const addNewUserHandler     = require('./route-handlers/create-new-user')
const getUserByIdHandler    = require('./route-handlers/get-user-by-id')
const listUsersHandler      = require('./route-handlers/list-users')
const updateUserByIdHandler = require('./route-handlers/update-user-by-id')
const deleteUserByIdHandler = require('./route-handlers/delete-user-by-id')

module.exports = {
  name: 'userService',
  version: '1.0.0',
  async register(server, options) {
    const routes = [
      {
        path:'/',
        method:'POST',
        options: {
          notes: 'Create a new user. An id (uuid v4) can be provided optionally. If not provided, it will be generated.',
          tags: ['api', 'user'],
          validate: {
            payload: pickProperties(userValidationSchema, ['id', 'name', 'dob', 'address', 'description']),
          }
        },
        handler: addNewUserHandler,
      },
      {
        path:'/',
        method:'GET',
        options: {
          notes: 'Returns a list of available users.',
          tags: ['api', 'users'],
          validate: {
            query: {
              limit: joi.number().integer().min(0).max(100).default(10),
              page: joi.number().integer().min(1).default(1),
            }
          }
        },
        handler: listUsersHandler
      },
      {
        path:'/{userId}',
        method:'GET',
        options: {
          tags: ['api', 'user'],
          validate: {
            params: {
              userId: joi.string().guid()
            }
          }
        },
        handler: getUserByIdHandler
      },
      {
        method:'PUT',
        path:'/{userId}',
        options: {
          tags: ['api', 'user'],
          validate: {
            params: {
              userId: joi.string().guid()
            },
            payload: pickProperties(userValidationSchema, ['name', 'dob', 'address', 'description'])
          }
        },
        handler: updateUserByIdHandler
      },
      {
        method:'DELETE',
        path:'/{userId}',
        options: {
          tags: ['api', 'user'],
          validate: {
            params: {
              userId: joi.string().guid()
            }
          }
        },
        handler: deleteUserByIdHandler
      }
    ]

    routes.map((route) => server.route(route))
  }
}
