import sinon from 'sinon';
import Validator from '@/validators/validator';
import {strict as assert} from 'assert';

describe('Validator', () => {
	describe('#constructor', () => {
		let validator, validate;

		beforeEach(() => {
			validate = sinon.stub();
			validator = new Validator(validate);
		});

		it('Should be an instanceof Validator.', async () => {
			assert.ok(validator instanceof Validator);
		});

		it('Should set _validate property.', async () => {
			assert.strictEqual(validator._validate, validate);
		});
	});
});
