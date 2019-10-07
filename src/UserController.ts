import * as moment from 'moment';
import * as pino from 'pino';
import * as uuid from 'uuid/v4';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';

export class UserController {
  private logger: pino.Logger = pino();

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
      dob: '2001-10-02T02:52:57.240Z',
      description: 'Described',
      createdAt: '2001-10-02T02:52:57.240Z',
      updatedAt: '2001-10-02T02:52:57.240Z',
    };
  }

  /**
   * Create a new user
   * @param  {UserCreate} userCreate
   * @returns User
   */
  public createUser = (userCreate: UserCreate): User => {
    return {
      ...userCreate,
      id: uuid(),
      createdAt: moment().toISOString(),
    };
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
      createdAt: 'todo',
      updatedAt: moment().toISOString(),
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
