import { generateRequest } from './util';
import HttpStatus from 'http-status-codes';

const create = require('../create.js');
jest.mock('../model/user');

describe('Create API', () => {
  test('201 CREATED', async () => {
    const input = generateRequest('create');
    const response = await create.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.CREATED);
  });

  test('422 UNPROCESSABLE_ENTITY - Invalid JSON', async () => {
    const input = generateRequest('create');
    input.event.body = "@#$%GFAWERASDFASER";
    const response = await create.main(input.event, input.context);

    expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('400 BAD_REQUEST - No required fields', async () => {
    const input = generateRequest('create');
    input.event.body = "{}";
    const response = await create.main(input.event, input.context);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(Object.keys(body.errors).length).toBe(8);
  });

  test('500 INTERNAL_SERVER_ERROR - Exception thrown in user', async () => {
    const input = generateRequest('create');
    let exceptionalBody = JSON.parse(input.event.body);
    exceptionalBody.name = "EXCEPTION";
    input.event.body = JSON.stringify(exceptionalBody);
    const response = await create.main(input.event, input.context);
    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
