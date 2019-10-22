import ExceptionHandler from '@/exceptions/handler';
import ResourceNotFoundException from '@/exceptions/resource-not-found-exception';
import sinon from 'sinon';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import {handler} from '@/lambdas/users-get';
import {strict as assert} from 'assert';

describe('UsersGet', () => {
	describe('#handler', () => {
		let get, event;

		beforeEach(() => {
			get = sinon.stub(DataMapper.prototype, 'get');
			event = {
				params: {
					path: {
						id: '6bd52ccb-2e46-4ebd-8432-7c9f691dbafc'
					}
				}
			};
		});

		afterEach(() => {
			get.restore();
		});

		it('Should return a user when mapper.get() is successful.', async () => {
			const user = new User({name: 'test'});
			get.returns(Promise.resolve(user));
			const response = await handler(event, {}, () => {
			});
			sinon.assert.calledOnce(get);
			assert.strictEqual(user.id, response.id);
			assert.strictEqual(user.name, response.name);
			assert.strictEqual(user.address, response.address);
			assert.strictEqual(user.createdAt, response.createdAt);
			assert.strictEqual(user.updatedAt, response.updatedAt);
		});

		it('Should throw ResourceNotFoundException on failure to get user.', async () => {
			get.returns(Promise.reject({name: 'ItemNotFoundException'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof ResourceNotFoundException);
				assert.strictEqual(err.errors[0].status, 404);
				assert.strictEqual(err.errors[0].title, 'ResourceNotFound');
				assert.strictEqual(err.errors[0].detail, 'User with id \'6bd52ccb-2e46-4ebd-8432-7c9f691dbafc\' does not exist.');
			});
			sinon.assert.calledOnce(get);
		});

		it('Should throw Exception on any other error.', async () => {
			get.returns(Promise.reject({message: 'ERROR'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
			});
			sinon.assert.calledOnce(get);
		});
	});
});