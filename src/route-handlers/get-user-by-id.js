const boom = require('boom')
const cleanseUserForResponse = require('../utils/transform-user-record-for-response')

/**
 * handler for fetching user by ID 
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {User} Fetched user
 */
module.exports = async function getUserById(request, responseHandler) {
  try {
    const fetchedUser = await request.mongo.db
      .collection('users')
      .findOne({ _id: request.params.userId })

    if (!fetchedUser) {
      return boom.notFound('User with provided id was not found.')
    } else {
      const cleansedUser = cleanseUserForResponse(fetchedUser)
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