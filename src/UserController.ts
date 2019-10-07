import * as moment from 'moment';
import { BaseLogger } from 'pino';
import { LogFactory } from './LogFactory';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';
import { UserDataAccess } from './UserDataAccess';

export class UserController {
  private readonly logger: BaseLogger = LogFactory.build(this.constructor.name);

  public constructor(private readonly userDataAccess: UserDataAccess) {
  }

  /**
   * Get the user for the given id
   * @param  {string} id
   * @returns User
   */
  public getUser = (id: string): User => {
    return {
      id,
      address: '123 Main',
      name: 'backend test',
      dob: moment('2001-10-02T02:52:57.240Z').valueOf(),
      description: 'Described',
      createdAt: moment('2001-10-02T02:52:57.240Z').valueOf(),
      updatedAt: moment('2001-10-02T02:52:57.240Z').valueOf(),
    };
  }

  /**
   * Create a new user
   * @param  {UserCreate} userCreate
   * @returns User
   */
  public createUser = async (userCreate: UserCreate): Promise<User> => {
    return await this.userDataAccess.putUser(userCreate);
  }

  /**
   * Update the userUpdate parameters for the given user's id
   * @param  {string} id
   * @param  {UserUpdate} userUpdate
   * @returns User
   */
  public updateUser = (id: string, userUpdate: UserUpdate): User => {
    return {
      id,
      ...userUpdate,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    };
  }

  /**
   * Delete the user for the given id
   * @param  {string} id
   * @returns void
   */
  public deleteUser = (id: string): void => {
    this.logger.info(id);
    return;
  }
}
