import uuid from "uuid";

const SERVER_ERROR = "Internal Server Error.";

export default class User {

  constructor(dynamoDbLib) {
    this.dynamoDbLib = dynamoDbLib;
  }

  async create(user) {
    const params = {
      TableName: process.env.tableName,
      Item: {
        id: uuid.v1(),
        name: user.name,
        dob: user.dob,
        streetAddress: user.address.streetAddress,
        streetAddress2: user.address.streetAddress2 || null,
        city: user.address.city,
        state: user.address.state,
        country: user.address.country,
        postal: user.address.postal,
        description: user.description,
        createdAt : Date.now()
      }
    };

    try {
      await this.dynamoDbLib.call("put", params);
    } catch (e) {
      console.error("Failed to create: " + JSON.stringify(user), "Message: " + e.message, "Stack: " +e.stack);
      throw new Error(SERVER_ERROR);
    }
  }

  async read(id) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      }
    };

    try {
      const result = await this.dynamoDbLib.call("get", params);
      return result.Item;
    } catch (e) {
      console.error("Failed to read: ID[" + id + "]", "Message: " + e.message, "Stack: " + e.stack);
      throw new Error(SERVER_ERROR);
    }
  }

  async update(id, user) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      },
      UpdateExpression: "SET " +
        "#name = :name, " +
        "dob = :dob, " +
        "streetAddress = :streetAddress, " +
        "streetAddress2 = :streetAddress2, " +
        "city = :city, " +
        "#state = :state, " +
        "country = :country, " +
        "postal = :postal, " +
        "description = :description, " +
        "updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":name": user.name,
        ":dob": user.dob,
        ":streetAddress": user.address.streetAddress,
        ":streetAddress2": user.address.streetAddress2 || null,
        ":city": user.address.city,
        ":state": user.address.state,
        ":country": user.address.country,
        ":postal": user.address.postal,
        ":description": user.description,
        ":updatedAt": Date.now()
      },
      // Reserved Words
      ExpressionAttributeNames: {
          "#name": "name",
          "#state": "state"
      },
      ReturnValues: "ALL_NEW"
    };

    try {
      const result = await this.dynamoDbLib.call("update", params);
      return result.Attributes;
    } catch (e) {
      console.error("Failed to update: ID[" + id + "] " + JSON.stringify(user), "Message: " + e.message, "Stack: " + e.stack);
      throw new Error(SERVER_ERROR);
    }
  }

  async delete(id) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      }
    };

    try {
      await this.dynamoDbLib.call("delete", params);
    } catch (e) {
      console.error("Failed to delete: ID[" + id + "]", "Message: " + e.message, "Stack: " + e.stack);
      throw new Error(SERVER_ERROR);
    }
  }
}
