/**
 * A single user object model
 * @type {Object: User} 
 */
const joi          = require('joi')
const generateUUID = require('uuid/v1')

module.exports = {
  "id": joi.string().guid().default(() => generateUUID(), 'Generate a uuid as default value'),
  "name": joi.string().min(1).max(64).default(null),
  "dob": joi.date().iso().default(null),
  "address": joi.string().max(250).default(null),
  "description": joi.string().max(500).default(null),
  "archived": joi.boolean().default(false),
  "createdAt": joi.date().iso().required(),
  "updatedAt": joi.date().iso().required(),
}