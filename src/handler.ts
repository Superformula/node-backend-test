import * as assert from "assert";
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid/v4";
import getConfig from "./getConfig";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

interface Container {
  config: { DynamoDB: object; stage: string };
  dynamodb: DynamoDB;
  client: DocumentClient;
  TableName: string;
}
type PathParameters = {
  userId: string;
};

const retrieveContainer: () => Container = () => {
  const config = getConfig();
  const dynamodb = new DynamoDB({ ...config.DynamoDB });

  return {
    config,
    dynamodb,
    client: new DynamoDB.DocumentClient({ service: dynamodb }),
    TableName: `${config.stage}-User`
  };
};

const getUser = async (userId: string, { client, TableName }: Container) => {
  const dynamoParams = {
    ExpressionAttributeValues: {
      ":id": userId
    },
    KeyConditionExpression: "id = :id",
    TableName
  };

  const result = await client.query(dynamoParams).promise();

  return result.Items && result.Items.length && result.Items[0];
};

const respondWithUser = async (userId: string, container: Container) => {
  const user = await getUser(userId, container);

  assert(user, "User Not Found");

  return {
    statusCode: 200,
    body: JSON.stringify(user)
  };
};

export const readUser: APIGatewayProxyHandler = async event => {
  try {
    const { userId } = event.pathParameters as PathParameters;
    assert(userId, "Invalid request");
    const container = retrieveContainer();

    const response = await respondWithUser(userId, container);
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

export const createUser: APIGatewayProxyHandler = async event => {
  try {
    assert(event.body, "Invalid request");
    const { name, dob, address, description } = JSON.parse(
      event.body as string
    );

    // ensure all fields are truthy
    assert(name && dob && address && description, "Invalid body");

    const container = retrieveContainer();
    const { client, TableName } = container;
    const id = uuid();
    const now = Date.now();

    const dynamoParams = {
      Item: {
        id,
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

    const response = await respondWithUser(id, container);
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

export const updateUser: APIGatewayProxyHandler = async event => {
  try {
    const { userId } = event.pathParameters as PathParameters;
    assert(userId && event.body, "Invalid request");
    const container = retrieveContainer();
    const { TableName, client } = container;
    const body = JSON.parse(event.body as string);
    const updateFields = ["name", "dob", "address", "description"].filter(
      field => body[field]
    );

    // ensure we have at least one field
    assert(updateFields.length, "Invalid Body");

    const now = Date.now();
    const updateExpressionList = [...updateFields, "updatedAt"].map(
      field => `#${field} = :${field}`
    );

    const ExpressionAttributeNames = updateFields.reduce(
      (memo, field) => ({
        ...memo,
        [`#${field}`]: field
      }),
      { ["#updatedAt"]: "updatedAt" }
    );

    const ExpressionAttributeValues = updateFields.reduce(
      (memo, field) => ({
        ...memo,
        [`:${field}`]: body[field]
      }),
      { [":updatedAt"]: now }
    );

    const dynamoParams = {
      TableName,
      Key: { id: userId },
      UpdateExpression: `SET ${updateExpressionList.join(", ")}`,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    };

    await client.update(dynamoParams).promise();

    const response = await respondWithUser(userId, container);
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};

export const deleteUser: APIGatewayProxyHandler = async event => {
  try {
    const { userId } = event.pathParameters as PathParameters;
    assert(userId, "Invalid request");
    const container = retrieveContainer();

    const user = await getUser(userId, container);
    assert(user, "User Not Found");

    const { TableName, client } = container;

    const dynamoParams = {
      TableName,
      Key: {
        id: userId
      }
    };

    await client.delete(dynamoParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
