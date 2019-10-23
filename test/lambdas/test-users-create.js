import Exception from '@/exceptions/exception';
import ExceptionHandler from '@/exceptions/handler';
import InvalidAttributeException from '@/exceptions/invalid-attribute';
import sinon from 'sinon';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import {handler} from '@/lambdas/users-create';
import {strict as assert} from 'assert';

const Lambda = require('aws-sdk/clients/lambda');

describe('UsersCreate', () => {
	describe('#handler', () => {
		let invokeAsync, put;

		beforeEach(() => {
			process.env.STACK_NAME = 'test';
			invokeAsync = Lambda.prototype.invokeAsync = sinon.stub();
			put = sinon.stub(DataMapper.prototype, 'put');
		});

		afterEach(() => {
			put.restore();
		});

		it('Should return a user when mapper.put() is successful.', async () => {
			const user = new User({name: 'test'});
			invokeAsync.withArgs({
				FunctionName: 'test-CloudFrontCreateInvalidation',
				InvokeArgs: JSON.stringify({paths: ['/api/v1/users']})
			}).returns({
				promise: () => {
					return Promise.resolve();
				}
			});
			put.returns(Promise.resolve(user));
			const event = {body: {name: 'test'}};
			const response = await handler(event, {}, () => {
			});
			sinon.assert.calledOnce(put);
			sinon.assert.calledOnce(invokeAsync);
			assert.strictEqual(user.id, response.id);
			assert.strictEqual(user.name, response.name);
		});

		it('Should throw InvalidAttributeException on validation error.', async () => {
			const event = {body: {}};
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof InvalidAttributeException);
				assert.strictEqual(err.errors[0].status, 422);
			});
			sinon.assert.notCalled(put);
			sinon.assert.notCalled(invokeAsync);
		});

		it('Should throw Exception on mapper.put() failure.', async () => {
			const event = {body: {name: 'test'}};
			put.returns(Promise.reject({message: 'error-message'}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
				assert.ok(err.errors[0] instanceof Exception);
				assert.strictEqual(err.errors[0].status, 500);
			});
			sinon.assert.calledOnce(put);
			sinon.assert.notCalled(invokeAsync);
		});

		it('Should throw Exception on Lambda.invokeAsync failure.', async () => {
			invokeAsync.withArgs({
				FunctionName: 'test-CloudFrontCreateInvalidation',
				InvokeArgs: JSON.stringify({paths: ['/api/v1/users']})
			}).returns({
				promise: () => {
					return Promise.reject({message: 'error-message'});
				}
			});
			const event = {body: {name: 'test'}};
			put.returns(Promise.resolve({}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
			});
			sinon.assert.calledOnce(put);
			sinon.assert.calledOnce(invokeAsync);
		});
	});
});
