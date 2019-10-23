import Exception from '@/exceptions/exception';
import InvalidAttributeException from '@/exceptions/invalid-attribute';
import {strict as assert} from 'assert';

describe('InvalidAttributeException', () => {
	describe('#constructor', () => {
		let exception;

		beforeEach(() => {
			exception = new InvalidAttributeException();
		});

		it('Should be an instanceof Exception.', async () => {
			assert.ok(exception instanceof Exception);
		});

		it('Should be an instance of InvalidAttributeException.', async () => {
			assert.ok(exception instanceof InvalidAttributeException);
		});

		it('Should have a default values.', async () => {
			assert.strictEqual(exception.status, 422);
			assert.strictEqual(exception.title, 'InvalidAttribute');
			assert.strictEqual(exception.detail, 'An unknown error occurred.');
		});

		it('Should override detail.', async () => {
			exception = new InvalidAttributeException('Custom error message.');
			assert.strictEqual(exception.detail, 'Custom error message.');
		});
	});
});
