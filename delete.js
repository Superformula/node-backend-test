import { success, failure } from "./libs/response-lib";
import User from './model/user';

export async function main(event, context) {
  let user = new User();
  try {
    await user.delete(event.pathParameters.id);
    return success({ status: true });
  } catch (e) {
    console.error("Exception thrown: ", e.stack);
    return failure({ status: false });
  }
}
