import { generateRequest } from './util';
import HttpStatus from 'http-status-codes';

const del = require('../delete.js');
jest.mock('../model/user');

describe('Delete API', () => {
  test('204 OK', async () => {
    const input = generateRequest('delete');
    const response = await del.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('delete');
    delete input.event['pathParameters'];
    const response = await del.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("ID Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('delete');
    input.event.pathParameters = {};
    const response = await del.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("ID Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('delete');
    // UUID V4 to test only accept UUID V1
    input.event.pathParameters.id = '5e028e8e-6b3e-4f34-bee7-a77d850e02ea';
    const response = await del.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toBe("{}");
  });

  test('404 NOT_FOUND', async () => {
    const input = generateRequest('delete');
    input.event.pathParameters.id = '6db52a20-178f-11ea-8d71-362b9e155667';
    const response = await del.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.body).toBe("{}");
  });

  test('500 INTERNAL_SERVER_ERROR', async () => {
    const input = generateRequest('delete');
    input.event.pathParameters.id = 'b9c9e570-1791-11ea-8d71-362b9e155667';
    const response = await del.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toBe("{}");
  });
});
