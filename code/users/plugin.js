const boom = require("boom");
const { fromMongo, toMongo, stamp } = require("../model-utils");
const schema = require("./schema");

module.exports = {
  name: "users",
  version: "1.0.0",
  async register(server) {
    server.route({
      method: "POST",
      path: "/",
      options: {
        tags: ["api"],
        response: { schema: schema.get },
        validate: {
          payload: schema.create
        }
      },
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        request.log("users", `Creating a user with id ${request.payload.id}`);

        let inUser = toMongo(request.payload);
        inUser = stamp(inUser);
        try {
          await users.insertOne(inUser);
          const user = await users.findOne({ _id: inUser._id });
          return h.response(fromMongo(user)).created();
        } catch (error) {
          if (error.code === 11000) {
            throw boom.conflict("A user with that id already exists");
          }
          throw error;
        }
      }
    });
    server.route({
      method: "GET",
      path: "/{userId}",
      options: {
        tags: ["api"],
        response: { schema: schema.get }
      },
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        const user = await users.findOne({ _id: request.params.userId });
        return h.response(fromMongo(user));
      }
    });
  }
};
