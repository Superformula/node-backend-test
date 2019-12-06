import { generateRequest } from './util';
import HttpStatus from 'http-status-codes';

const update = require('../update.js');
jest.mock('../model/user');

describe('Update API', () => {
  test('200 OK', async () => {
    const input = generateRequest('update');
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body).name).toBe("Graham Evans");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('update');
    delete input.event['pathParameters'];
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("ID Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('update');
    input.event.pathParameters = {};
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("ID Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY - Invalid JSON', async () => {
    const input = generateRequest('update');
    input.event.body = "@#$%GFAWERASDFASER";
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('update');
    // UUID V4 to test only accept UUID V1
    input.event.pathParameters.id = '5e028e8e-6b3e-4f34-bee7-a77d850e02ea';
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toBe("{}");
  });

  test('404 NOT_FOUND', async () => {
    const input = generateRequest('update');
    input.event.pathParameters.id = '6db52a20-178f-11ea-8d71-362b9e155667';
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.body).toBe("{}");
  });

  test('500 INTERNAL_SERVER_ERROR', async () => {
    const input = generateRequest('update');
    let exceptionalBody = JSON.parse(input.event.body);
    exceptionalBody.name = "EXCEPTION";
    input.event.body = JSON.stringify(exceptionalBody);
    const response = await update.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toBe("{}");
  });
});
