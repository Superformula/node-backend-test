module.exports = {
  name: "users",
  version: "1.0.0",
  async register(server, options) {
    server.route({
      method: "POST",
      path: "/",
      options: {
        validate: {
          payload: require("./create-schema")
        }
      },
      handler: async (request, h) =>
        h
          .response(request.payload) // FIXME
          .created()
    });
  }
};
