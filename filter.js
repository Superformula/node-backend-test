import { success, failure } from "./libs/response-lib";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';

/**
 * Filter API Lambda for User model.
 */
export async function main(event, context) {
  try {
    if (!('pathParameters' in event)) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "Name Path Parameter required."});
    }
    const name = event.pathParameters.name;

    if (!name) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "Name Path Parameter required."});
    }

    let user = new User(dynamoDbLib);
    try {
      const result = await user.filter(name);
      return success(HttpStatus.OK, result);
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid request body: " + event.body);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
