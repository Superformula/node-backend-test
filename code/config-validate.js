const config = require("config3");
const joi = require("joi");
const summarize = require("joi-summarize");

const port = joi.number().port();
const schema = joi.object().keys({
  SBT_VERSION: joi.string().regex(/\d+\.\d+\.\d+/),
  SBT_HOST: joi.string().hostname(),
  SBT_PORT: port,
  SBT_MONGO_HOST: joi.string().hostname(),
  SBT_MONGO_PORT: port.default(2017),
  SBT_MONGO_DB_NAME: joi.string().max(100)
});

const result = schema.validate(config, { abortEarly: false });
if (result.error) {
  process.stderr.write(summarize(result.error, "Invalid Configuration"));
  process.exit(66); // eslint-disable-line no-process-exit
}
module.exports = result.value;
