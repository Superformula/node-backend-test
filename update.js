import { success, failure } from "./libs/response-lib";
import User from './model/user';

export async function main(event, context) {
  const data = JSON.parse(event.body);

  let user = new User();
  try {
    const result = await user.update(event.pathParameters.id, data);
    if (result) {
      return success({ status: true, user : result});
    } else {
      return failure({ status: false });
    }
  } catch (e) {
    console.error("Exception thrown: ", e.stack);
    return failure({ status: false });
  }
}
