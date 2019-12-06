import { success, failure } from "./libs/response-lib";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { userValidationCriteria } from './validators/user';
import validate from 'validate.js';

/**
 * Create API Lambda for User model.
 */
export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    const errors = validate(data, userValidationCriteria);

    if (errors) {
      return failure(HttpStatus.BAD_REQUEST, {errors : errors});
    }

    let user = new User(dynamoDbLib);
    try {
      const result = await user.create(data);
      return success(HttpStatus.CREATED, result);
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid request body: " + event.body);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
