'use strict'

const toMongoDb = doc => {
  const ret = { _id: doc.id, ...doc }
  delete ret.id
  // do not allow createdAt and updatedAt to be modified by input
  delete ret.createdAt
  delete ret.updatedAt
  return ret
}

const fromMongoDb = doc => {
  const ret = { id: doc._id, ...doc._doc }
  delete ret._id
  delete ret.__v
  return ret
}

module.exports = { toMongoDb, fromMongoDb }
