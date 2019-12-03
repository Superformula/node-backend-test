import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: "SET #name = :name, dob = :dob, address = :address, description = :description, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":name": data.name || null,
      ":dob": data.dob || null,
      ":address": data.address || null,
      ":description": data.description || null,
      ":updatedAt": Date.now()
    },
    ExpressionAttributeNames: {
        "#name": "name"
    },
    ReturnValues: "NONE"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.error("Exception thrown: ", e.stack);
    return failure({ status: false });
  }
}
