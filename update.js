import { success, failure } from "./libs/response-lib";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { userValidationCriteria, UUID_V1 } from './validators/user';
import validate from 'validate.js';

/**
 * Update API Lambda for User model.
 */
export async function main(event, context) {
  try {
    if (!('pathParameters' in event)) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "ID Path Parameter required."});
    }
    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const errors = validate(data, userValidationCriteria);

    if (!id) {
      return failure(HttpStatus.UNPROCESSABLE_ENTITY, {error : "ID Path Parameter required."});
    } else if (!id.match(UUID_V1)) {
      throw {message : "Required UUID V1 format."};
    } else if (errors) {
      return failure(HttpStatus.BAD_REQUEST, {errors : errors});
    }

    let user = new User(dynamoDbLib);
    try {
      const exists = await user.read(id);
      if (!exists) {
        return failure(HttpStatus.NOT_FOUND, {});
      }
      const result = await user.update(id, data);
      return success(HttpStatus.OK, result);
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid request, body: " + event.body + " pathParameters: " + JSON.stringify(event.pathParameters));
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
