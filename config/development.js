const DYNAMODB_ENDPOINT = "http://localhost:8000";
const DYNAMODB_REGION = "us-fake-1";
const DYNAMODB_ACCESS_KEY_ID = "fake";
const DYNAMODB_SECRET_ACCESS_KEY = "fake";

module.exports = {
  DynamoDB: {
    endpoint: DYNAMODB_ENDPOINT,
    region: DYNAMODB_REGION,
    accessKeyId: DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY
  },
  stage: "development"
};
