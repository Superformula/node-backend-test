const boom                   = require('boom')
const cleanseUserForResponse = require('../utils/transform-user-record-for-response')

/**
 * Create new user route handler
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {User} New user object
 */
module.exports = async function createNewUser(request, responseHandler) {
  // add system generated properties
  const systemGeneratedProperties = {
    createdAt: new Date().toISOString(),
  }

  // assure updatedAt is exactly the same as createdAt at this point.
  systemGeneratedProperties.updatedAt = systemGeneratedProperties.createdAt
  const newUser = Object.assign(request.payload, systemGeneratedProperties)
  
  // rename id to _id for mongoDB's sake
  newUser._id = newUser.id
  delete newUser.id

  try {
    const usersCollection = request.mongo.db.collection('users')
    const existingUser = usersCollection.findOne({ _id: newUser._id })

    if (existingUser && Object.keys(existingUser).length > 0) {
      return boom.conflict(`User with provided id already exists.`)
    } else {
      await usersCollection.insertOne(newUser)
      const createdUser = await usersCollection.findOne({ _id: newUser._id })
      const cleansedUser = cleanseUserForResponse(createdUser)
      
      return { 
        type: 'User', 
        item: cleansedUser 
      }
    }

  } catch (createError) {
    request.log(['error'], createError)
    return boom.badImplementation()
  }
}