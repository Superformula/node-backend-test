const hapi = require("hapi");
const config = require("./config-validate");

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

  await server.register({
    plugin: require("./health-plugin"),
    options: { version: config.SBT_VERSION }
  });
  return server;
}

module.exports = { setup };
