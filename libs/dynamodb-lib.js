import AWS from "aws-sdk";

/**
 * Bootstrap and provide method to call DynamoDB.
 */
export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}
