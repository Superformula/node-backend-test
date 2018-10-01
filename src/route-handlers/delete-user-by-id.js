const boom = require('boom')

/**
 * Delete user by their id
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {Response}
 */
module.exports = async function deleteUserById(request, responseHandler) {
  
  try {
    await request.mongo.db.collection('users').deleteOne({ _id: request.params.userId })
    return {}
  } catch (deleteUserError) {
    request.log(['error'], deleteUserError)
    return boom.badImplementation()
  }
}