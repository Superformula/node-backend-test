const boom = require('boom')
const cleanseUserForResponse = require('../utils/transform-user-record-for-response')
/**
 * handler for fetching user by ID 
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {User} Fetched user
 */
module.exports = async function updateUserById(request, responseHandler) {
  try {
    const fetchedUser = await request.server.methods.getUserById(request.params.userId)

    if (!fetchedUser) {
      return boom.notFound('User with provided id was not found.')
    } else {

      const updatedUserRecord = Object.assign(fetchedUser, request.payload, {
        updatedAt: new Date().toISOString(),
        createdAt: fetchedUser.createdAt
      })

      await request.server.methods.updateUser(request.params.userId, updatedUserRecord)
      const cleansedUser = cleanseUserForResponse(updatedUserRecord)
      
      return {
        type: 'User', 
        item: cleansedUser,
      }
    }
  } catch (fetchError) {
    request.log(['error'], fetchError)
    return boom.badImplementation()
  }
  
}