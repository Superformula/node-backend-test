const boom = require("boom");
const modelUtils = require("../model-utils");
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

        let inUser = modelUtils.toMongo(request.payload);
        inUser = modelUtils.created(inUser);
        try {
          await users.insertOne(inUser);
          const user = await users.findOne({ _id: inUser._id });
          return h.response(modelUtils.fromMongo(user)).created();
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
        validate: {
          params: schema.delete
        },
        response: { schema: schema.get }
      },
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        const user = await users.findOne({ _id: request.params.userId });
        if (!user) {
          throw boom.notFound();
        }
        return h.response(modelUtils.fromMongo(user));
      }
    });

    server.route({
      method: "PATCH",
      path: "/{userId}",
      options: {
        tags: ["api"],
        validate: {
          params: schema.delete,
          payload: schema.update
        },
        response: {
          schema: schema.get
        }
      },
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        request.log("users", `Updating user with id ${request.params.userId}`);
        const delta = modelUtils.updated({
          id: request.params.userId,
          ...request.payload
        });
        const result = await users.findAndModify(
          { _id: delta._id },
          [["_id", 1]],
          { $set: delta },
          { new: true }
        );
        if (result.lastErrorObject.n < 1) {
          throw boom.notFound();
        }
        return h.response(modelUtils.fromMongo(result.value));
      }
    });

    server.route({
      method: "DELETE",
      path: "/{userId}",
      options: {
        tags: ["api"],
        validate: {
          params: schema.delete
        }
      },
      handler: async (request, h) => {
        const users = request.mongo.db.collection("users");
        request.log("users", `Deleting user with id ${request.params.userId}`);
        const { result } = await users.deleteOne({
          _id: request.params.userId
        });
        if (result.n < 1) {
          throw boom.notFound();
        }
        return h.response();
      }
    });
  }
};
