const joi = require("joi");
const modelUtils = require("../model-utils");

const id = joi
  .string()
  .uuid()
  .required();
const name = joi
  .string()
  .max(100)
  .required();
const dob = joi.string().isoDate();
const address = joi.string().max(500);
const description = joi.string().max(5000);

const createKeys = { id, name, dob, address, description };
exports.create = joi.object().keys(createKeys);
exports.delete = joi.object().keys({ userId: id });
exports.get = modelUtils.timestampSchema(createKeys);
exports.update = joi.object().keys({
  id: id.optional(),
  name: name.optional(),
  dob,
  address,
  description
});
