"use strict";
const config = require("./config-validate");
const hapi = require("hapi");
const path = require("path");

async function setup({
  host = config.SBT_HOST,
  port = config.SBT_PORT,
  logLevel = "debug"
} = {}) {
  const server = hapi.server({ debug: false, host, port });
  await server.register({
    plugin: require("hapi-pino"),
    options: { mergeHapiLogData: true }
  });

  server.logger().level = logLevel;
  server.log(
    "info",
    `Superformula Test server version ${config.SBT_VERSION} starting`
  );

  // await server.register([require("./errors-plugin")]);
  return server;
}

module.exports = { setup };
