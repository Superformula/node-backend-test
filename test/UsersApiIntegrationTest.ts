import * as moment from 'moment';
import * as supertest from 'supertest';
import { User } from '../src/model/User';
import { UserCreate } from '../src/model/UserCreate';

const UUID_LENGTH: number = 36;

describe('POST /users', () => {
  const api: supertest.SuperTest<supertest.Test> = supertest('http://localhost:3000');

  test('creates user', async () => {
    const userCreate: UserCreate = createNewUser();
    const user: User = (await api.post('/users')
      .send(userCreate)
      .expect(200))
      .body;
    expect(user).toBeDefined();
    expect(user.id).toHaveLength(UUID_LENGTH);
    expect(user.createdAt).not.toBeNull();
    expect(user.updatedAt).toBeUndefined();
  });
});

describe('GET / users / { id }', () => {
  const api: supertest.SuperTest<supertest.Test> = supertest('http://localhost:3000');
  let createdUser: User;
  beforeAll(async () => {
    const userCreate: UserCreate = createNewUser();
    createdUser = (await api.post('/users')
      .send(userCreate)
      .expect(200))
      .body;
  });

  test('gets user', async () => {
    const fetchedUser: User = (await api.get(`/users/${createdUser.id}`)
      .send()
      .expect(200))
      .body;
    expect(fetchedUser.id).toEqual(createdUser.id);
    expect(fetchedUser.createdAt).toEqual(createdUser.createdAt);
    expect(fetchedUser).toEqual(createdUser);
  });

  test('receives status 404 with bad id', async () => {
    await api.get('/users/invalid')
      .send()
      .expect(404);
  });
});

const createNewUser = (): UserCreate => {
  return {
    address: '123 Main',
    description: 'test create user',
    dob: moment('1997-03-26').valueOf(),
    name: 'Test User',
  };
};
