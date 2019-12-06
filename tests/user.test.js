import * as dynamoDbLib from "../libs/dynamodb-lib";
import { generateUser } from './util';
import User from '../model/user';

describe('User Model', () => {
  test('Create Success', async () => {
      dynamoDbLib.call = jest.fn()
      const user = new User(dynamoDbLib);
      await expect(user.create(generateUser())).resolves.not.toThrow();
      expect(dynamoDbLib.call).toBeCalledTimes(1);
  });
  test('Create Fail', async () => {
    dynamoDbLib.call = jest.fn(() => {throw "Internal Error"});
    const user = new User(dynamoDbLib);
    await expect(user.create(generateUser())).rejects.toThrow('Internal Server Error.');
    expect(dynamoDbLib.call).toBeCalledTimes(1);
  });

  test('Read Success', async () => {
      dynamoDbLib.call = jest.fn(() => {return { Item : generateUser()}});
      const user = new User(dynamoDbLib);
      await expect(user.read("id")).resolves.not.toThrow();
      expect(dynamoDbLib.call).toBeCalledTimes(1);
  });
  test('Read Fail', async () => {
    dynamoDbLib.call = jest.fn(() => {throw "Internal Error"});
    const user = new User(dynamoDbLib);
    await expect(user.read("id")).rejects.toThrow('Internal Server Error.');
    expect(dynamoDbLib.call).toBeCalledTimes(1);
  });

  test('Update Success', async () => {
      dynamoDbLib.call = jest.fn(() => { return {Attributes : ""}});
      const user = new User(dynamoDbLib);
      await expect(user.update("id", generateUser())).resolves.not.toThrow();
      expect(dynamoDbLib.call).toBeCalledTimes(1);
  });
  test('Update Fail', async () => {
    dynamoDbLib.call = jest.fn(() => {throw "Internal Error"});
    const user = new User(dynamoDbLib);
    await expect(user.update("id", generateUser())).rejects.toThrow('Internal Server Error.');
    expect(dynamoDbLib.call).toBeCalledTimes(1);
  });

  test('Delete Success', async () => {
      dynamoDbLib.call = jest.fn()
      const user = new User(dynamoDbLib);
      await expect(user.delete("id")).resolves.not.toThrow();
      expect(dynamoDbLib.call).toBeCalledTimes(1);
  });
  test('Delete Fail', async () => {
    dynamoDbLib.call = jest.fn(() => {throw "Internal Error"});
    const user = new User(dynamoDbLib);
    await expect(user.delete("id")).rejects.toThrow('Internal Server Error.');
    expect(dynamoDbLib.call).toBeCalledTimes(1);
  });

  test('Filter Success', async () => {
      dynamoDbLib.call = jest.fn(() => {return {Items : []}});
      const user = new User(dynamoDbLib);
      await expect(user.filter("Graham Evans")).resolves.not.toThrow();
      expect(dynamoDbLib.call).toBeCalledTimes(1);
  });
  test('Filter Fail', async () => {
    dynamoDbLib.call = jest.fn(() => {throw "Internal Error"});
    const user = new User(dynamoDbLib);
    await expect(user.filter("Graham Evans")).rejects.toThrow('Internal Server Error.');
    expect(dynamoDbLib.call).toBeCalledTimes(1);
  });
});
