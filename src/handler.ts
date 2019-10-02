import * as assert from "assert";
import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid/v4";
import getConfig from "./getConfig";

const { config } = getConfig();
const dynamodb = new DynamoDB({ ...config.DynamoDB });
const client = new DynamoDB.DocumentClient({ service: dynamodb });
const TableName = `${config.stage}-User`;

const getUser = async (userId: string) => {
  const dynamoParams = {
    ExpressionAttributeValues: {
      ":id": userId
    },
    KeyConditionExpression: "id = :id",
    TableName
  };

  const result = await client.query(dynamoParams).promise();

  return result.Items;
};

export const readUser: APIGatewayProxyHandler = async event => {
  const userId = event.pathParameters.userId;

  assert(userId, "500");

  return getUser(userId);
};

export const createUser: APIGatewayProxyHandler = async event => {
  const { name, dob, address, description } = event.body;

  assert(name && dob && address && description, "500");

  const now = Date.now();
  const dynamoParams = {
    Item: {
      id: uuid(),
      name,
      dob,
      address,
      description,
      createdAt: now,
      updatedAt: now
    },
    TableName
  };

  await client.put(dynamoParams).promise();

  return true;
};

export const updateUser: APIGatewayProxyHandler = async event => {
  const userId = event.pathParameters.userId;
  const { name, dob, address, description } = event.body;
  const updateFields = [name, dob, address, description];

  assert(userId, "500");

  assert(updateFields.find(field => event.body[field]), "500");

  const user = getUser(userId);

  assert(user, "500");

  const now = Date.now();
  const updateExpressionList = [...updateFields, "updatedAt"].map(
    field => `${field} = :${field}`
  );

  const expressionAttributeValues = updateFields.reduce(
    (memo, field) => ({
      ...memo,
      [`:${field}`]: event.body[field]
    }),
    { [":updatedAt"]: now }
  );

  const dynamoParams = {
    TableName,
    Key: { id: userId },
    UpdateExpression: `SET ${updateExpressionList.join(",")}`,
    ExpressionAttributeValues: expressionAttributeValues
  };

  await client.update(dynamoParams).promise();

  return true;
};

export const deleteUser: APIGatewayProxyHandler = async event => {
  const userId = event.pathParameters.userId;

  assert(userId, "500");

  const dynamoParams = {
    TableName,
    Key: {
      id: userId
    }
  };

  await client.delete(dynamoParams).promise();

  return true;
};
