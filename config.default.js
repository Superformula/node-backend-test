"use strict";
const { join } = require("path");
const pack = require("./package");

const config = {
  SBT_VERSION: pack.version,
  SBT_HOST: process.env.SBT_HOST || "localhost",
  SBT_PORT: process.env.SBT_PORT || 3000
};

module.exports = config;
