const joi = require("joi");

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

function stamp(doc) {
  const now = new Date().toISOString();
  if (doc.createdAt) {
    return { updatedAt: now, ...doc };
  }
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

module.exports = { timestampSchema, toMongo, fromMongo, stamp, updated };
