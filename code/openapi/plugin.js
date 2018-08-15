module.exports = {
  name: "openapi",
  version: "1.0.0",
  async register(server) {
    const options = {
      info: {
        title: "Superformula Back-end Test API",
        version: require("../../package").version
      }
    };

    await server.register([
      require("inert"),
      require("vision"),
      {
        plugin: require("hapi-swagger"),
        options
      }
    ]);
  }
};
