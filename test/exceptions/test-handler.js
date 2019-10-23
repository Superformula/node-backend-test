import Exception from '@/exceptions/exception';
import ExceptionHandler from '@/exceptions/handler';
import InvalidAttributeException from '@/exceptions/invalid-attribute';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import {strict as assert} from 'assert';

describe('ExceptionHandler', () => {
	describe('#constructor', () => {
		let handler;

		beforeEach(() => {
			handler = new ExceptionHandler();
		});

		it('Should be an instanceof ExceptionHandler.', async () => {
			assert.ok(handler instanceof ExceptionHandler);
		});

		it('Should have a default value.', async () => {
			assert.ok(handler.errors[0] instanceof Exception);
			assert.strictEqual(handler.errors[0].detail, 'An unknown error occurred.');
		});

		it('Should allow single Error.', async () => {
			handler = new ExceptionHandler(new Exception('Custom error message.'));
			assert.ok(handler.errors[0] instanceof Exception);
			assert.strictEqual(handler.errors[0].detail, 'Custom error message.');
		});

		it('Should allow an array of Errors.', async () => {
			handler = new ExceptionHandler([
				new Exception('Custom error message.'),
				new InvalidAttributeException('Invalid attribute message.'),
				new ResourceNotFoundException()
			]);
			assert.ok(handler.errors[0] instanceof Exception);
			assert.strictEqual(handler.errors[0].detail, 'Custom error message.');
			assert.ok(handler.errors[1] instanceof InvalidAttributeException);
			assert.strictEqual(handler.errors[1].detail, 'Invalid attribute message.');
			assert.ok(handler.errors[2] instanceof ResourceNotFoundException);
			assert.strictEqual(handler.errors[2].detail, 'Resource with id \'unknown\' does not exist.');
		});
	});
});
