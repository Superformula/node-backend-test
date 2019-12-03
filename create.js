import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      id: uuid.v1(),
      name: data.name,
      dob: data.dob,
      address: data.address,
      description: data.description,
      createdAt : Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.error("Exception thrown: ", e.stack);
    return failure({ status: false });
  }
}
