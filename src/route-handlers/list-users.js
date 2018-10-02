const boom = require('boom')
const cleanseUserForResponse = require('../utils/transform-user-record-for-response')

/**
 * @description List user records ordered by most recently updated ones.
 * @param  {Hapi: Request} request        
 * @param  {Hapi: Response} responseHandler
 * @return {Array: Users} All users
 */
module.exports = async function listUsers(request, responseHandler) {

  try {
    const itemsToSkip = (request.query.page - 1) * request.query.limit

    const fetchedUsers = await request.mongo.db
      .collection('users')
      .find({ archived: false }, { name: true, id: true, updatedAt: true })
      .sort({ updatedAt: -1 })
      .limit(request.query.limit)
      .skip(itemsToSkip)
      .toArray()

    const parsedUsers = fetchedUsers.map(user => cleanseUserForResponse(user))

    return { 
      type: 'UserList', 
      items: parsedUsers,
      count: fetchedUsers.length,
      // TODO: add next page link
    }
  } catch (fetchError) {
    request.log(['error'], fetchError)
    return boom.badImplementation()
  }
  
}