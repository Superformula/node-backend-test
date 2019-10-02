import { UserController } from "../src/UserController";

describe('UserControllerTest', () => {
  let userController: UserController;

  beforeAll(() => {
    userController = new UserController();
  });

  test('getUser returns user', () => {
    const user: any = userController.getUser('1');
    expect(user).not.toBeNull();
    expect(user.id).toBe('1');
  });
});
