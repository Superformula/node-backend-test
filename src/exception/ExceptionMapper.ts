import { APIGatewayProxyResult } from 'aws-lambda';
import { BaseLogger } from 'pino';
import { LogFactory } from '../LogFactory';
import { NotFoundException } from './NotFoundException';

export class ExceptionMapper {
  private readonly logger: BaseLogger = LogFactory.build(this.constructor.name);
  public map = (exception: Error): APIGatewayProxyResult => {
    if (exception instanceof NotFoundException) {
      return { statusCode: 404, body: JSON.stringify({ msg: exception.msg }) };
    } else {
      this.logger.error(exception);
      return { statusCode: 500, body: JSON.stringify({ msg: 'An unexpected error has occurred' }) };
    }
  }
}
