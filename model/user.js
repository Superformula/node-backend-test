import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";

export default class User {
  async create(user) {
    const params = {
      TableName: process.env.tableName,
      Item: {
        id: uuid.v1(),
        name: user.name,
        dob: user.dob,
        address: user.address,
        description: user.description,
        createdAt : Date.now()
      }
    };

    await dynamoDbLib.call("put", params);
  }

  async read(id) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      }
    };

    return await dynamoDbLib.call("get", params);
  }

  async update(id, user) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      },
      UpdateExpression: "SET #name = :name, dob = :dob, address = :address, description = :description, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":name": user.name || null,
        ":dob": user.dob || null,
        ":address": user.address || null,
        ":description": user.description || null,
        ":updatedAt": Date.now()
      },
      ExpressionAttributeNames: {
          "#name": "name"
      },
      ReturnValues: "ALL_NEW"
    };

    const result = await dynamoDbLib.call("update", params);
    return result.Attributes;
  }

  async delete(id) {
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      }
    };

    await dynamoDbLib.call("delete", params);
  }
}
