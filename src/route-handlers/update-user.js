const boom = require('boom')

/**
 * handler for fetching user by ID 
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {User} Fetched user
 */
module.exports = async function updateUserById(request, responseHandler) {
  try {
    const fetchedUser = await request.mongo.db
      .collection('users')
      .findOne({ _id: request.params.userId })

    request.log(['error'], 'what?' + JSON.stringify(request.params))
    if (!fetchedUser) {
      return boom.notFound('User with provided id was not found.')
    } else {
      return {
        type: 'User', 
        item: fetchedUser,
      }
    }
  } catch (fetchError) {
    request.log(['error'], fetchError)
    return boom.badImplementation()
  }
  
}