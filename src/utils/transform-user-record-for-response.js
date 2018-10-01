/**
 * @description  Function that transforms a user record for exposure in response. 
 * Currently, only renames mongoDB _id property to id.
 * 
 * @param  {User} userRecord
 * @return {User}
 */
module.exports = function transformUserRecord(user){
  user.id = user._id
  delete user._id
  return user
}