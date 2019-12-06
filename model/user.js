import uuid from "uuid";

const SERVER_ERROR = "Internal Server Error.";

/**
 * User model for encapsulating User CRUD and Filter operations
 */
export default class User {

  /**
   * Dependency Injection for unit testability
   * @param {function} dynamoDbLib Function to call DynamoDB.
   */
  constructor(dynamoDbLib) {
    this.dynamoDbLib = dynamoDbLib;
  }

  /**
   * Create a user.
   * @param {obj} user User object containing user information.
   */
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
      return params.Item;
    } catch (e) {
      console.error("Failed to create: " + JSON.stringify(user), "Message: " + e.message, "Stack: " + e.stack);
      throw new Error(SERVER_ERROR);
    }
  }

  /**
   * Read a user by ID.
   * @param {string} id UUID for user.
   */
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

  /**
   * Update a user by ID.
   * @param {string} id UUID for user.
   * @param {obj} user User object containing user information.
   */
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

  /**
   * Read a user by ID.
   * @param {string} id UUID for user.
   */
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

  /**
   * Query for users with same name.
   * @param {string} name Name to query for list of users with same name.
   */
  async filter(name) {
    const params = {
      TableName: process.env.tableName,
      IndexName: "username",
      KeyConditionExpression: "#name = :name",
      ExpressionAttributeNames: {
          "#name": "name"
      },
      ExpressionAttributeValues: {
          ":name": name
      },
    };

    try {
      const result = await this.dynamoDbLib.call("query", params);
      return result.Items;
    } catch (e) {
      console.error("Failed to query: Name[" + name + "]", "Message: " + e.message, "Stack: " + e.stack);
      throw new Error(SERVER_ERROR);
    }
  }
}
