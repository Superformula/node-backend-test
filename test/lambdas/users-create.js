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
			invokeAsync = Lambda.prototype.invokeAsync = sinon.stub();
			put = sinon.stub(DataMapper.prototype, 'put');
		});

		afterEach(() => {
			put.restore();
		});

		it('Should return a user when mapper.put() is successful.', async () => {
			invokeAsync.returns({
				promise: () => {
					return Promise.resolve();
				}
			});
			const user = new User({name: 'test'});
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
				assert.strictEqual(err.errors[0].title, 'InvalidAttribute');
				assert.strictEqual(err.errors[0].detail, 'Name can\'t be blank');
			});
			sinon.assert.notCalled(put);
			sinon.assert.notCalled(invokeAsync);
		});

		it('Should throw Exception on mapper.put() failure.', async () => {
			const event = {body: {name: 'test'}};
			put.returns(Promise.reject({}));
			await handler(event, {}, (err) => {
				assert.ok(err instanceof ExceptionHandler);
			});
			sinon.assert.calledOnce(put);
			sinon.assert.notCalled(invokeAsync);
		});

		it('Should throw Exception on Lambda.invokeAsync failure.', async () => {
			invokeAsync.returns({
				promise: () => {
					return Promise.reject({});
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