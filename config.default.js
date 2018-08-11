"use strict";
const pack = require("./package");

const config = {
  SBT_VERSION: pack.version,
  SBT_HOST: process.env.SBT_HOST || "localhost",
  SBT_PORT: process.env.SBT_PORT || 3000,
  SBT_MONGO_HOST: process.env.SBT_MONGO_HOST || "mongo",
  SBT_MONGO_PORT: process.env.SBT_MONGO_PORT || 27017,
  SBT_MONGO_DB_NAME: process.env.SBT_MONGO_DB_NAME || "sbt"
};

module.exports = config;
