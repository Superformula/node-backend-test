import Exception from '@/exceptions/exception';
import ExceptionHandler from '@/exceptions/handler';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import sinon from 'sinon';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import {handler} from '@/lambdas/users-delete';
import {strict as assert} from 'assert';

const Lambda = require('aws-sdk/clients/lambda');

describe('UsersDelete', () => {
	describe('#handler', () => {
		let event, invokeAsync, get, deleteStub, user;

		beforeEach(() => {
			process.env.STACK_NAME = 'test';
			event = {
				params: {
					path: {
						id: '6bd52ccb-2e46-4ebd-8432-7c9f691dbafc'
					}
				}
			};
			invokeAsync = Lambda.prototype.invokeAsync = sinon.stub();
			get = sinon.stub(DataMapper.prototype, 'get');
			deleteStub = sinon.stub(DataMapper.prototype, 'delete');
			user = new User({name: 'test'});
		});

		afterEach(() => {
			get.restore();
			deleteStub.restore();
		});

		it('Should delete the user and return empty.', async () => {
			get.returns(Promise.resolve(user));
			deleteStub.returns(Promise.resolve(user.id));
			invokeAsync.withArgs({
				FunctionName: 'test-CloudFrontCreateInvalidation',
				InvokeArgs: JSON.stringify({paths: ['/api/v1/users', `/api/v1/users/${user.id}`]})
			}).returns({
				promise: () => {
					return Promise.resolve();
				}
			});
			const response = await handler(event, {}, () => {
			});
			sinon.assert.calledOnce(get);
			sinon.assert.calledOnce(deleteStub);
			assert.equal(response, undefined);
		});

		it('Should throw ResourceNotFoundException if user does not exist.', async () => {
			get.returns(Promise.reject({name: 'ItemNotFoundException'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof ResourceNotFoundException);
				assert.strictEqual(err.errors[0].status, 404);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.notCalled(deleteStub);
		});

		it('Should throw Exception for all other mapper.get() errors.', async () => {
			get.returns(Promise.reject({message: 'error-message'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.notCalled(deleteStub);
		});

		it('Should throw Exception mapper.delete() errors.', async () => {
			get.returns(Promise.resolve(user));
			deleteStub.returns(Promise.reject({message: 'error-message'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.calledOnce(deleteStub);
		});

		it('Should throw Exception for invokeAsync errors.', async () => {
			get.returns(Promise.resolve(user));
			deleteStub.returns(Promise.resolve(user.id));
			invokeAsync.withArgs({
				FunctionName: 'test-CloudFrontCreateInvalidation',
				InvokeArgs: JSON.stringify({paths: ['/api/v1/users', `/api/v1/users/${user.id}`]})
			}).returns({
				promise: () => {
					return Promise.reject({message: 'error-message'});
				}
			});
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(get);
			sinon.assert.calledOnce(deleteStub);
		});
	});
});
