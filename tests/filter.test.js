import { generateRequest } from './util';
import HttpStatus from 'http-status-codes';

const filter = require('../filter.js');
jest.mock('../model/user');

describe('Filter API', () => {
  test('200 OK', async () => {
    const input = generateRequest('filter');
    const response = await filter.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(response.body).length).toBe(2);
    expect(JSON.parse(response.body)[0].name).toBe("Graham Evans");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('filter');
    delete input.event['pathParameters'];
    const response = await filter.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("Name Path Parameter required.");
  });

  test('422 UNPROCESSABLE_ENTITY', async () => {
    const input = generateRequest('filter');
    input.event.pathParameters = {};
    const response = await filter.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(JSON.parse(response.body).error).toBe("Name Path Parameter required.");
  });

  test('500 INTERNAL_SERVER_ERROR', async () => {
    const input = generateRequest('filter');
    input.event.pathParameters.name = 'Bad Name';
    const response = await filter.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toBe("{}");
  });
});
