const joi = require("joi");
const modelUtils = require("../model-utils");

const createKeys = {
  id: joi
    .string()
    .uuid()
    .required(),
  name: joi
    .string()
    .max(100)
    .required()
};
exports.create = joi.object().keys(createKeys);

exports.get = modelUtils.timestampSchema(createKeys);
