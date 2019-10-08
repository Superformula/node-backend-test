import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { ExceptionMapper } from './exception/ExceptionMapper';
import { User } from './model/User';
import { UserCreate } from './model/UserCreate';
import { UserUpdate } from './model/UserUpdate';
import { UserController } from './UserController';
import { UserDataAccess } from './UserDataAccess';

const userController: UserController = new UserController(new UserDataAccess());
const exceptionMapper: ExceptionMapper = new ExceptionMapper();

export const getUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const id: string = event.pathParameters.id;
    const user: User = await userController.getUser(id);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return exceptionMapper.map(error);
  }

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
    return exceptionMapper.map(error);
  }
};

export const updateUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const userUpdate: UserUpdate = JSON.parse(event.body);
    const id: string = event.pathParameters.id;
    const user: User = await userController.updateUser(id, userUpdate);
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return exceptionMapper.map(error);
  }
};

export const deleteUser: Handler = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const id: string = event.pathParameters.id;
    await userController.deleteUser(id);
    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    return exceptionMapper.map(error);
  }
};
