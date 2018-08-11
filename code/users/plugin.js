const boom = require("boom");

module.exports = {
  name: "users",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "POST",
      path: "/",
      options: {
        validate: {
          payload: require("./create-schema")
        }
      },
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        request.log("users", `Creating a user with id ${request.payload.id}`);
        const inUser = { _id: request.payload.id, ...request.payload };
        delete inUser.id;
        try {
          await users.insertOne(inUser);
          const user = await users.findOne({ _id: inUser._id });
          return h.response(user).created();
        } catch (error) {
          if (error.code === 11000) {
            throw boom.conflict();
          }
          throw error;
        }
      }
    });
    server.route({
      method: "GET",
      path: "/{userId}",
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        const user = await users.findOne({ _id: request.params.userId });
        return h.response(user);
      }
    });
  }
};
