import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import { FatalException } from './exception/FatalException';
import { NotFoundException } from './exception/NotFoundException';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';

export class UserDataAccess {
  private static TABLE: string = 'users';
  private documentClient: DocumentClient;

  public constructor(options?: { region: string, endpoint: string }) {
    this.documentClient = new DocumentClient(options);
  }

  public putUser = async (userCreate: UserCreate): Promise<User> => {
    const id: string = uuid();
    const user: User = { id, ...userCreate, createdAt: moment().valueOf() };
    const input: DocumentClient.PutItemInput = {
      TableName: UserDataAccess.TABLE,
      Item: user,
    };
    await this.documentClient.put(input).promise().catch((reason: any) => {
      throw new FatalException('Error saving record', reason);
    });
    return user;
  }

  public getUserOrFail = async (id: string): Promise<User> => {
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
}
