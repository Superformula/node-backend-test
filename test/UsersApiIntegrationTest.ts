import * as moment from 'moment';
import * as supertest from 'supertest';
import { User } from '../src/model/User';
import { UserCreate } from '../src/model/UserCreate';

const UUID_LENGTH: number = 36;
const api: supertest.SuperTest<supertest.Test> = supertest('http://localhost:3000');

describe('POST /users', () => {

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

describe('with an existing user', () => {
  let createdUser: User;

  beforeEach(async () => {
    const userCreate: UserCreate = createNewUser();
    createdUser = (await api.post('/users')
      .send(userCreate)
      .expect(200))
      .body;
  });

  describe('GET /users/{id}', () => {
    test('gets user', async () => {
      const fetchedUser: User = (await api.get(`/users/${createdUser.id}`)
        .send()
        .expect(200))
        .body;
      expect(fetchedUser.id).toEqual(createdUser.id);
      expect(fetchedUser.createdAt).toEqual(createdUser.createdAt);
      expect(fetchedUser).toEqual(createdUser);
    });

    test('errors with bad id', async () => {
      await api.get('/users/invalid')
        .send()
        .expect(404);
    });
  });

  describe('PUT /users/{id}', () => {
    const newName: string = 'new name';

    test('updates the user', async () => {
      const updatedUser: User = (await api.put(`/users/${createdUser.id}`)
        .send({ name: newName })
        .expect(200))
        .body;
      expect(updatedUser.updatedAt).toBeDefined();
      expect(updatedUser.name).toEqual(newName);
      expect(createdUser.name).not.toEqual(newName);
    });

    test('errors with a bad id', async () => {
      await api.put('/users/invalid')
        .send({ name: newName })
        .expect(404);
    });
  });

  describe('DELETE /users/{id}', () => {
    test('deletes a user', async () => {
      await api.delete(`/users/${createdUser.id}/`)
        .send()
        .expect(204);

      await api.get(`/users/${createdUser.id}/`)
        .send()
        .expect(404);
    });

    test('deleting an invalid id provides a success response', async () => {
      await api.delete('/users/invalid/')
        .send()
        .expect(204);
    });
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
