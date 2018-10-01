/**
 * A single user object model
 * @type {Object: User} 
 */
const joi          = require('joi')
const generateUUID = require('uuid/v1')

module.exports = {
  "id": joi.string().guid().default(() => generateUUID(), 'Generate a uuid if one is not provided'),
  "name": joi.string().min(1).max(64),
  "dob": joi.date().iso(),
  "address": joi.string().max(250),
  "description": joi.string().max(500),
  "createdAt": joi.date().iso().required(),
  "updatedAt": joi.date().iso().required(),
}