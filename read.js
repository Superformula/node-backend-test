import { success, failure } from "./libs/response-lib";
import User from './model/user';

export async function main(event, context) {
  let user = new User();
  try {
    const result = await user.read(event.pathParameters.id);
    if (result.Item) {
      return success(result.Item);
    } else {
      return failure({ status: false, error: "User not found." });
    }
  } catch (e) {
    return failure({ status: false });
  }
}
