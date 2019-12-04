import { success, failure } from "./libs/response-lib";
import User from './model/user';
import HttpStatus from 'http-status-codes';
import { userValidationCriteria } from './validators/user';
import validate from 'validate.js';

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    const errors = validate(data, userValidationCriteria);

    if (errors) {
      return failure(HttpStatus.BAD_REQUEST, {status:false, errors : errors});
    }

    let user = new User();
    try {
      await user.create(data);
      return success(HttpStatus.CREATED, {});
    } catch (e) {
      return failure(HttpStatus.INTERNAL_SERVER_ERROR, { status: false });
    }
  } catch (e) {
    console.info("Invalid request body: " + event.body);
    return failure(HttpStatus.UNPROCESSABLE_ENTITY, {status : false, });
  }
}
