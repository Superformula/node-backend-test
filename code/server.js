const config = require("./config-validate");
const hapi = require("hapi");

const V1_PREFIX = "/api/v1";
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

  const dbOpts = {
    url: `mongodb://${config.SBT_MONGO_HOST}:${config.SBT_MONGO_PORT}/${
      config.SBT_MONGO_DB_NAME
    }`,
    settings: {
      poolSize: 10
    },
    decorate: true
  };

  await server.register({
    plugin: require("hapi-mongodb"),
    options: dbOpts
  });
  await server.register({
    plugin: require("./health-plugin"),
    options: { version: config.SBT_VERSION }
  });
  await server.register(
    {
      plugin: require("./users/plugin"),
      options: { hey: 42 }
    },
    {
      routes: { prefix: `${V1_PREFIX}/users` }
    }
  );
  return server;
}

module.exports = { setup };
