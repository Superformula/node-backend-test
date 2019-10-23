import sinon from 'sinon';
import {handler} from '@/lambdas/cloudfront-create-invalidation';
import {strict as assert} from 'assert';

const CloudFront = require('aws-sdk/clients/cloudfront');

describe('CloudFrontCreateInvalidation', () => {
	describe('#handler', () => {
		let createInvalidation; let clock; let event; const now = new Date();

		beforeEach(() => {
			process.env.DISTRIBUTION_ID = 'test1234';
			createInvalidation = CloudFront.prototype.createInvalidation = sinon.stub();
			clock = sinon.useFakeTimers(now.getTime());
			event = {
				paths: ['/api/v1/test', '/api/v1/test/12345']
			};
		});

		afterEach(() => {
			clock.restore();
		});

		it('Should create a CloudFront invalidation with the provided paths.', async () => {
			createInvalidation.withArgs({
				DistributionId: 'test1234',
				InvalidationBatch: {
					CallerReference: `${now.getTime()}`,
					Paths: {
						Quantity: 2,
						Items: ['/api/v1/test', '/api/v1/test/12345']
					}
				}
			}).returns({
				promise: () => {
					return Promise.resolve({message: 'success'});
				}
			});
			const response = await handler(event, {}, () => {
			});
			assert.strictEqual(response.message, 'success');
		});

		it('Should return empty when no paths are provided.', async () => {
			event.paths = null;
			const response = await handler(event, {}, () => {
			});
			assert.strictEqual(response, undefined);
		});

		it('Should throw Exception when createInvalidation fails.', async () => {
			createInvalidation.withArgs({
				DistributionId: 'test1234',
				InvalidationBatch: {
					CallerReference: `${now.getTime()}`,
					Paths: {
						Quantity: 2,
						Items: ['/api/v1/test', '/api/v1/test/12345']
					}
				}
			}).returns({
				promise: () => {
					return Promise.reject({message: 'error-message'});
				}
			});
			await handler(event, {}, (err) => {
				assert.strictEqual(err.message, 'error-message');
			});
		});
	});
});
