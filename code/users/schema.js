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
const createKeys = { id, name };
exports.create = joi.object().keys({ id, name });
exports.delete = joi.object().keys({ userId: id });
exports.get = modelUtils.timestampSchema(createKeys);
