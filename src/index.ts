import { APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import * as pino from 'pino';
import { UserController } from './UserController';

const logger: pino.Logger = pino();
const userController: UserController = new UserController();

export const getUser: Handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  logger.info(event);
  logger.info(context);
  const user: any = userController.getUser('1');
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};
