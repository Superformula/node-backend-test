import { success, failure } from "./libs/response-lib";
import User from './model/user';

export async function main(event, context) {
  const data = JSON.parse(event.body);

  let user = new User();
  try {
    await user.create(data);
    return success();
  } catch (e) {
    console.error("Exception thrown: ", e.stack);
    return failure({ status: false });
  }
}
