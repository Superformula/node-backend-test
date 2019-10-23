import Exception from '@/exceptions/exception';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import {strict as assert} from 'assert';

describe('ResourceNotFoundException', () => {
	describe('#constructor', () => {
		let exception;

		beforeEach(() => {
			exception = new ResourceNotFoundException();
		});

		it('Should be an instanceof Exception.', async () => {
			assert.ok(exception instanceof Exception);
		});

		it('Should be an instance of ResourceNotFoundException.', async () => {
			assert.ok(exception instanceof ResourceNotFoundException);
		});

		it('Should have a default values.', async () => {
			assert.strictEqual(exception.status, 404);
			assert.strictEqual(exception.title, 'ResourceNotFound');
			assert.strictEqual(exception.detail, 'Resource with id \'unknown\' does not exist.');
		});

		it('Should override detail.', async () => {
			exception = new ResourceNotFoundException('User', '44b1ef3d-0542-4cb2-81fc-5fbe414aa752');
			assert.strictEqual(exception.detail, 'User with id \'44b1ef3d-0542-4cb2-81fc-5fbe414aa752\' does not exist.');
		});
	});
});
