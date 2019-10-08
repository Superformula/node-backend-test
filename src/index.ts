import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { UserController } from './core/UserController';
import { UserDataAccess } from './core/UserDataAccess';
import { ExceptionMapper } from './exception/ExceptionMapper';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';

const userController: UserController = new UserController(new UserDataAccess());
const exceptionMapper: ExceptionMapper = new ExceptionMapper();

export const getUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  return await handle(async () => {
    const id: string = event.pathParameters.id;
    const user: User = await userController.getUser(id);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  }, event);
};

export const createUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  return await handle(async () => {
    const userCreate: UserCreate = JSON.parse(event.body);
    const user: User = await userController.createUser(userCreate);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  }, event);
};

export const updateUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  return await handle(async () => {
    const userUpdate: UserUpdate = JSON.parse(event.body);
    const id: string = event.pathParameters.id;
    const user: User = await userController.updateUser(id, userUpdate);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  }, event);
};

export const deleteUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  return await handle(async () => {
    const id: string = event.pathParameters.id;
    await userController.deleteUser(id);
    return {
      statusCode: 204,
      body: '',
    };
  }, event);
};

const handle = async (method: Handler, event: any): Promise<APIGatewayProxyResult> => {
  try {
    return await method(event, null, null);
  } catch (error) {
    return exceptionMapper.map(error);
  }
};
