const boom = require('boom')

/**
 * Delete user by their id
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {Response}
 */
module.exports = async function deleteUserById(request, responseHandler) {
  
  try {
    const userRecord = await request.mongo.db
      .collection('users')
      .findOne({ _id: request.params.userId, archived: false })

    if (!userRecord) {
      return boom.notFound()
    } else {
      userRecord.archived = true

      await request.mongo.db
        .collection('users')
        .updateOne({ _id: request.params.userId }, userRecord)
      
      return {}
    }

  } catch (deleteUserError) {
    request.log(['error'], deleteUserError)
    return boom.badImplementation()
  }
}