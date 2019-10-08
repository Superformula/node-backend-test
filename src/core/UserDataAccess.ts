import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import { FatalException } from '../exception/FatalException';
import { NotFoundException } from '../exception/NotFoundException';
import { User } from '../model/User';
import { UserCreate } from '../model/UserCreate';
import { UserUpdate } from '../model/UserUpdate';

export class UserDataAccess {
  private static TABLE: string = 'users';
  private documentClient: DocumentClient;

  public constructor() {
    // This information should eventually be configured through an env file
    // or something more robust.
    let dynamoEnv: {};
    if (process.argv[4] === '--stage' && process.argv[5] === 'local') {
      dynamoEnv = { region: 'localhost', endpoint: 'http://localhost:8000' };
    }
    this.documentClient = new DocumentClient(dynamoEnv);
  }

  /**
   * Create a new user
   * @param  {UserCreate} userCreate
   * @returns Promise
   */
  public createUser = async (userCreate: UserCreate): Promise<User> => {
    const id: string = uuid();
    return this.putUser({ id, ...userCreate, createdAt: moment().valueOf() });
  }

  /**
   * Update an existing user.  Only properties specified on userUpdate will be updated.
   * Missing properties will not be removed
   * @param  {string} id
   * @param  {UserUpdate} userUpdate
   * @returns Promise
   * @throws NotFoundException if the user does not exist
   */
  public updateUser = async (id: string, userUpdate: UserUpdate): Promise<User> => {
    const savedUser: User = await this.getUser(id);
    const mergedUser: User = { ...savedUser, ...userUpdate, updatedAt: moment().valueOf() };
    return this.putUser(mergedUser);
  }

  /**
   * Get an existing user
   * @param  {string} id
   * @returns Promise
   * @throws NotFoundException if the user does not exist
   */
  public getUser = async (id: string): Promise<User> => {
    const input: DocumentClient.GetItemInput = { TableName: UserDataAccess.TABLE, Key: { id } };
    const output: DocumentClient.GetItemOutput = await this.documentClient.get(input).promise()
      .catch((reason: any) => {
        throw new FatalException('Error saving record', reason);
      });

    if (!output || !output.Item) {
      throw new NotFoundException(`User not found: ${id}`);
    }
    return output.Item as User;
  }

  /**
   * Delete a user.  This will always succeed if it finds a user or not.
   * @param  {string} id
   * @returns Promise
   */
  public deleteUser = async (id: string): Promise<void> => {
    const input: DocumentClient.DeleteItemInput = { TableName: UserDataAccess.TABLE, Key: { id } };
    await this.documentClient.delete(input).promise();
  }

  private putUser = async (user: User): Promise<User> => {
    const input: DocumentClient.PutItemInput = {
      TableName: UserDataAccess.TABLE,
      Item: user,
    };
    await this.documentClient.put(input).promise().catch((reason: any) => {
      throw new FatalException('Error saving record', reason);
    });
    return user;
  }
}
