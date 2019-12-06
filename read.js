import { success, failure } from "./libs/response-lib";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { UUID_V1 } from './validators/user';

/**
 * Read API Lambda for User model.
 */
export async function main(event, context) {
  try {
    if (!('pathParameters' in event)) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "ID Path Parameter required."});
    }
    const id = event.pathParameters.id;

    if (!id) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "ID Path Parameter required."});
    } else if (!id.match(UUID_V1)) {
      throw {message : "Required UUID V1 format."};
    }

    let user = new User(dynamoDbLib);
    try {
      const result = await user.read(id);
      if (!result) {
        return failure(HttpStatus.NOT_FOUND, {});
      }
      return success(HttpStatus.OK, result);
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid ID [" + event.pathParameters.id + "]", e.message);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
