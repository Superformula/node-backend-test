const generateUUID = require('uuid/v1')

/**
 * Create new user route handler
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {User} New user object
 */
module.exports = async function createNewUser(request, responseHandler) {
  // add system generated properties
  const systemGeneratedProperties = { 
    id: generateUUID(), 
    createdAt: new Date().toISOString(),
  }

  // assure updatedAt is exactly the same as createdAt at this point.
  systemGeneratedProperties.updatedAt = systemGeneratedProperties.createdAt

  const newUser = Object.assign(request.payload, systemGeneratedProperties)

  return { 
    type: 'User', 
    item: newUser 
  }
}