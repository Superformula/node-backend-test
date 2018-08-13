const joi = require("joi");

// toMongo/fromMongo handle conversion to use "id" and a standard uuid-v4
// in our API responses
// instead of the weird mongoism "_id" and custom MongoID type.
// It's a hassle but it's probably important if we ever need to change
// databases
function toMongo(doc) {
  const newDoc = { _id: doc.id, ...doc };
  delete newDoc.id;
  return newDoc;
}

function fromMongo(doc) {
  const newDoc = { id: doc._id, ...doc };
  delete newDoc._id;
  return newDoc;
}

function created(doc) {
  const now = new Date().toISOString();
  return { createdAt: now, ...doc };
}

function updated(doc) {
  return { updatedAt: new Date().toISOString(), ...toMongo(doc) };
}

function timestampSchema(keys) {
  return joi.object().keys({
    createdAt: joi
      .string()
      .isoDate()
      .required(),
    updatedAt: joi.string().isoDate(),
    ...keys
  });
}

module.exports = { timestampSchema, toMongo, fromMongo, created, updated };
