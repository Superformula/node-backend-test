import { generateRequest } from './util';
import HttpStatus from 'http-status-codes';

const read = require('../read.js');
jest.mock('../model/user');

describe('Read API', () => {
  test('200 OK', async () => {
    const input = generateRequest('read');
    const response = await read.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body).name).toBe("Graham Evans");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('read');
    delete input.event['pathParameters'];
    const response = await read.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("ID Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('read');
    input.event.pathParameters = {};
    const response = await read.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("ID Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('read');
    // UUID V4 to test only accept UUID V1
    input.event.pathParameters.id = '5e028e8e-6b3e-4f34-bee7-a77d850e02ea';
    const response = await read.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toBe("{}");
  });

  test('404 NOT_FOUND', async () => {
    const input = generateRequest('read');
    input.event.pathParameters.id = '6db52a20-178f-11ea-8d71-362b9e155667';
    const response = await read.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.body).toBe("{}");
  });

  test('500 INTERNAL_SERVER_ERROR', async () => {
    const input = generateRequest('read');
    input.event.pathParameters.id = 'b9c9e570-1791-11ea-8d71-362b9e155667';
    const response = await read.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toBe("{}");
  });
});
