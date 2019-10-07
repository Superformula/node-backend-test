import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import * as pino from 'pino';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';
import { UserController } from './UserController';

const logger: pino.Logger = pino();
const userController: UserController = new UserController();

export const getUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const id: string = event.pathParameters.id;
  const user: User = userController.getUser(id);
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const createUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  logger.debug('createUser!!!');
  const userCreate: UserCreate = JSON.parse(event.body);
  const user: User = userController.createUser(userCreate);
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const updateUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const userUpdate: UserUpdate = JSON.parse(event.body);
  const id: string = event.pathParameters.id;
  const user: User = userController.updateUser(id, userUpdate);
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const deleteUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const id: string = event.pathParameters.id;
  userController.deleteUser(id);
  return {
    statusCode: 204,
    body: '',
  };
};
