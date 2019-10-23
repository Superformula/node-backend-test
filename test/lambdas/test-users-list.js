import Exception from '@/exceptions/exception';
import ExceptionHandler from '@/exceptions/handler';
import sinon from 'sinon';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import {handler} from '@/lambdas/users-list';
import {strict as assert} from 'assert';

describe('UsersList', () => {
	describe('#handler', () => {
		let scan;

		beforeEach(() => {
			scan = sinon.stub(DataMapper.prototype, 'scan');
		});

		afterEach(() => {
			scan.restore();
		});

		it('Should return a list of users when mapper.scan() is successful.', async () => {
			const user1 = new User({name: 'test1'});
			const user2 = new User({name: 'test2'});
			const users = {};
			users[Symbol.asyncIterator] = async function * () {
				yield user1;
				yield user2;
			};
			scan.returns(users);
			const response = await handler({}, {}, () => {
			});
			sinon.assert.calledOnce(scan);
			assert.strictEqual(user1, response[0]);
			assert.strictEqual(user2, response[1]);
		});

		it('Should return empty list on mapper.scan() empty or failure.', async () => {
			const users = {};
			users[Symbol.asyncIterator] = async function * () {
			};
			scan.returns(users);
			const response = await handler({}, {}, () => {
			});
			sinon.assert.calledOnce(scan);
			assert.ok(Array.isArray(response));
			assert.strictEqual(response.length, 0);
		});

		it('Should throw Exception on failure.', async () => {
			scan.throws({message: 'error-message'});
			await handler({}, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(scan);
		});
	});
});
