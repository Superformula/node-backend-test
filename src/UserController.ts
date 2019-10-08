import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';
import { UserDataAccess } from './UserDataAccess';

export class UserController {

  public constructor(private readonly userDataAccess: UserDataAccess) {
  }

  /**
   * Get the user for the given id
   * @param  {string} id
   * @returns Promise<User>
   */
  public getUser = async (id: string): Promise<User> => {
    return this.userDataAccess.getUser(id);
  }

  /**
   * Create a new user
   * @param  {UserCreate} userCreate
   * @returns Promise<User>
   */
  public createUser = async (userCreate: UserCreate): Promise<User> => {
    return this.userDataAccess.createUser(userCreate);
  }

  /**
   * Update the userUpdate parameters for the given user's id
   * @param  {string} id
   * @param  {UserUpdate} userUpdate
   * @returns Promise<User>
   */
  public updateUser = async (id: string, userUpdate: UserUpdate): Promise<User> => {
    return this.userDataAccess.updateUser(id, userUpdate);
  }

  /**
   * Delete the user for the given id
   * @param  {string} id
   * @returns Promise<void>
   */
  public deleteUser = async (id: string): Promise<void> => {
    return this.userDataAccess.deleteUser(id);
  }
}
