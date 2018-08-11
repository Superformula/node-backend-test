const joi = require("joi");

module.exports = joi.object().keys({
  id: joi
    .string()
    .uuid()
    .required(),
  name: joi
    .string()
    .max(100)
    .required()
});
