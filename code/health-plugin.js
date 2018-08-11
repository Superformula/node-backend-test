const startTime = Date.now();

module.exports = {
  name: "health",
  version: "1.0.0",
  async register(server, options) {
    server.route({
      method: "GET",
      path: "/health",
      handler: async () => ({
        version: options.version,
        startTime
      })
    });
  }
};
