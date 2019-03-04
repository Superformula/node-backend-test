'use strict'

const toMongoDb = doc => {
  return Object.assign({ _id: doc.id }, doc, { id: undefined })
}

const fromMongoDb = doc => {
  return Object.assign({ id: doc._id }, doc._doc, { _id: undefined })
}

module.exports = { toMongoDb, fromMongoDb }
