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
    const userCollection = request.mongo.db.collection('users')
    const fetchedUser    = await userCollection.findOne({ _id: request.params.userId })

    if (!fetchedUser) {
      return boom.notFound('User with provided id was not found.')
    } else {

      const updatedUserRecord = Object.assign(request.payload, {
        createdAt: fetchedUser.createdAt,
        updatedAt: new Date().toISOString(),
      })

      await userCollection.updateOne({ _id: request.params.userId }, updatedUserRecord)
      const cleansedUser = cleanseUserForResponse(updatedUserRecord)
      cleansedUser.id = fetchedUser._id
      
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