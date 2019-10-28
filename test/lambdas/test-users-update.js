import Exception from '@/exceptions/exception';
import ExceptionHandler from '@/exceptions/handler';
import InvalidAttributeException from '@/exceptions/invalid-attribute';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import sinon from 'sinon';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import {handler} from '@/lambdas/users-update';
import {strict as assert} from 'assert';

const Lambda = require('aws-sdk/clients/lambda');

describe('UsersUpdate', () => {
	describe('#handler', () => {
		let event, invokeAsync, get, update, user;

		beforeEach(() => {
			process.env.STACK_NAME = 'test';
			event = {
				params: {
					path: {
						id: '6bd52ccb-2e46-4ebd-8432-7c9f691dbafc'
					}
				},
				body: {
					name: 'updated'
				}
			};
			invokeAsync = Lambda.prototype.invokeAsync = sinon.stub();
			get = sinon.stub(DataMapper.prototype, 'get');
			update = sinon.stub(DataMapper.prototype, 'update');
			user = new User({name: 'test'});
		});

		afterEach(() => {
			get.restore();
			update.restore();
		});

		it('Should update the user and return the updated user.', async () => {
			get.returns(Promise.resolve(user));
			const updated = new User(event.body);
			update.returns(Promise.resolve(updated));
			invokeAsync.withArgs({
				FunctionName: 'test-CloudFrontCreateInvalidation',
				InvokeArgs: JSON.stringify({paths: ['/api/v1/users', '/api/v1/users?*', `/api/v1/users/${updated.id}`]})
			}).returns({
				promise: () => {
					return Promise.resolve();
				}
			});
			const response = await handler(event, {}, () => {
			});
			sinon.assert.calledOnce(get);
			sinon.assert.calledOnce(update);
			assert.strictEqual(response.id, updated.id);
			assert.strictEqual(response.name, updated.name);
		});

		it('Should throw ResourceNotFoundException if user does not exist.', async () => {
			get.returns(Promise.reject({name: 'ItemNotFoundException'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof ResourceNotFoundException);
				assert.strictEqual(err.errors[0].status, 404);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.notCalled(update);
		});

		it('Should throw InvalidAttributeException if updated user validation fails.', async () => {
			get.returns(Promise.resolve(user));
			event.body = {};
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof InvalidAttributeException);
				assert.strictEqual(err.errors[0].status, 422);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.notCalled(update);
		});

		it('Should throw Exception for all other mapper.get() errors.', async () => {
			get.returns(Promise.reject({message: 'error-message'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.notCalled(update);
		});

		it('Should throw Exception mapper.update() errors.', async () => {
			get.returns(Promise.resolve(user));
			update.returns(Promise.reject({message: 'error-message'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.calledOnce(update);
		});

		it('Should update the user and return user for invokeAsync errors.', async () => {
			get.returns(Promise.resolve(user));
			const updated = new User(event.body);
			update.returns(Promise.resolve(updated));
			invokeAsync.withArgs({
				FunctionName: 'test-CloudFrontCreateInvalidation',
				InvokeArgs: JSON.stringify({paths: ['/api/v1/users', '/api/v1/users?*', `/api/v1/users/${updated.id}`]})
			}).returns({
				promise: () => {
					return Promise.reject({message: 'error-message'});
				}
			});
			const response = await handler(event, {}, () => {
			});
			sinon.assert.calledOnce(get);
			sinon.assert.calledOnce(update);
			assert.strictEqual(response.id, updated.id);
			assert.strictEqual(response.name, updated.name);
		});
	});
});
