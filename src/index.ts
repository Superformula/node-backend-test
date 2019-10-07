import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { BaseLogger } from 'pino';
import { LogFactory } from './LogFactory';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';
import { UserController } from './UserController';
import { UserDataAccess } from './UserDataAccess';

const userController: UserController = new UserController(new UserDataAccess({ region: 'localhost', endpoint: 'http://localhost:8000' }));
const logger: BaseLogger = LogFactory.build('index');
export const getUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const id: string = event.pathParameters.id;
  const user: User = userController.getUser(id);
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const createUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const userCreate: UserCreate = JSON.parse(event.body);
    const user: User = await userController.createUser(userCreate);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    logger.error(error);
  }
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
