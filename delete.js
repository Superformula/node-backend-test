import { success, failure } from "./libs/response-lib";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { UUID_V1 } from './validators/user';

/**
 * Delete API Lambda for User model.
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
      throw { message : "Required UUID V1 format." };
    }

    let user = new User(dynamoDbLib);
    try {
      const exists = await user.read(id);
      if (!exists) {
        return failure(HttpStatus.NOT_FOUND, {});
      }
      await user.delete(id);
      return success(HttpStatus.NO_CONTENT, {});
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid Request, Path Parameters: [" + JSON.stringify(event.pathParameters) + "]", e.message);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
