import * as moment from 'moment';
import { User } from '../src/model/User';
import { UserCreate } from '../src/model/UserCreate';
import { UserUpdate } from '../src/model/UserUpdate';
import { UserController } from '../src/UserController';

const UUID_LENGTH: number = 36;

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

  test('createUser creates id and createdDate', async () => {
    const userCreate: UserCreate = {
      address: '123 Main',
      description: 'test create user',
      dob: moment('1997-03-26').toISOString(),
      name: 'Test User',
    };
    const user: User = userController.createUser(userCreate);
    expect(user).not.toBeNull();
    expect(user.id).toHaveLength(UUID_LENGTH);
    expect(user.createdAt).not.toBeNull();
    expect(user.updatedAt).toBeUndefined();
  });

  describe('with existing user', () => {
    let createdUser: User;
    const userCreate: UserCreate = {
      address: '123 Main',
      description: 'test create user',
      dob: moment('1997-03-26').toISOString(),
      name: 'Test User',
    };

    beforeEach(() => {
      createdUser = userController.createUser(userCreate);
    });

    test('updateUser updates a user', () => {
      const userUpdate: UserUpdate = { ...userCreate };
      const newName: string = 'New Name';
      userUpdate.name = newName;
      const user: User = userController.updateUser(createdUser.id, userUpdate);
      expect(user.id).toBe(createdUser.id);
      expect(user.updatedAt).toBeDefined();
      expect(user.name).toBe(newName);
    });
  });
});
