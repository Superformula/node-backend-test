import { success, failure } from "./libs/response-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { userValidationCriteria, UUID_V1 } from './validators/user';
import validate from 'validate.js';

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    const id = event.pathParameters.id;
    const errors = validate(data, userValidationCriteria);

    if (!id.match(UUID_V1)) {
      return failure(HttpStatus.BAD_REQUEST, {});
    } else if (errors) {
      return failure(HttpStatus.BAD_REQUEST, {errors : errors});
    }

    let user = new User();
    try {
      const exists = await user.read(id);
      if (!exists.Item) {
        return failure(HttpStatus.NOT_FOUND, {});
      }

      const result = await user.update(id, data);
      return success(HttpStatus.OK, result);
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, {});
    }
  } catch (e) {
    console.info("Invalid request body: " + event.body);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {});
  }
}
