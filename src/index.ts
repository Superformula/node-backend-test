import { APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import * as pino from 'pino';

const logger: pino.Logger = pino();

export const getUser: Handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  logger.info(event);
  logger.info(context);
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: 'unique',
      address: '123 Main',
      name: 'backend test',
      dob: '2001-10-02T02:52:57.240Z',
      description: 'Described',
      createdAt: '2001-10-02T02:52:57.240Z',
      updatedAt: '2001-10-02T02:52:57.240Z',
    }),
  };
};
