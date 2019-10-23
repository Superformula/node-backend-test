import Exception from '@/exceptions/exception';
import {strict as assert} from 'assert';

describe('Exception', () => {
	describe('#constructor', () => {
		let exception;

		beforeEach(() => {
			exception = new Exception();
		});

		it('Should be an instanceof Exception.', async () => {
			assert.ok(exception instanceof Exception);
		});

		it('Should have a default values.', async () => {
			assert.strictEqual(exception.status, 500);
			assert.strictEqual(exception.title, 'InternalServiceError');
			assert.strictEqual(exception.detail, 'An unknown error occurred.');
		});

		it('Should override detail.', async () => {
			exception = new Exception('Custom error message.');
			assert.strictEqual(exception.detail, 'Custom error message.');
		});
	});
});
