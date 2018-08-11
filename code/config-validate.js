"use strict";
const config = require("config3");
const joi = require("joi");
const summarize = require("joi-summarize");

const port = joi
  .number()
  .min(1025)
  .max(65535);
const schema = joi.object().keys({
  SBT_VERSION: joi.string().regex(/\d+\.\d+\.\d+/),
  SBT_HOST: joi.string().hostname(),
  SBT_PORT: port
});

const result = schema.validate(config, { abortEarly: false });
if (result.error) {
  process.stderr.write(summarize(result.error, "Invalid Configuration"));
  process.exit(66); // eslint-disable-line no-process-exit
}
module.exports = result.value;
