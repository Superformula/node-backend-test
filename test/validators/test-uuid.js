import sinon from 'sinon';
import UuidValidator from '@/validators/uuid';
import validate from 'validate.js';
import Validator from '@/validators/validator';
import {strict as assert} from 'assert';

describe('UuidValidator', () => {
	describe('#constructor', () => {
		let validator, validateStub;

		beforeEach(() => {
			validateStub = sinon.stub();
			validator = new UuidValidator(validateStub);
		});

		it('Should be an instanceof Validator.', async () => {
			assert.ok(validator instanceof Validator);
		});

		it('Should be an instanceof UuidValidator.', async () => {
			assert.ok(validator instanceof UuidValidator);
		});
	});

	describe('#validate', () => {
		let validator;

		beforeEach(() => {
			validator = new UuidValidator(validate);
			validator.register();
		});

		it('Should pass for valid values', async () => {
			const values = [
				{},
				{test: null},
				{test: 'da28f222-f552-11e9-802a-5aa538984bd8'}, // uuid v1
				{test: '51872ed8-5e1e-4cad-8c35-4fab633339fb'} // uuid v4
			];
			const constraints = {
				test: {
					uuid: true
				}
			};
			values.forEach((value) => {
				const response = validate(value, constraints);
				assert.strictEqual(response, undefined);
			});
		});

		it('Should fail for invalid values', async () => {
			const values = [
				{test: 'invalid'},
				{test: 13245},
				{test: new Date()},
				{test: '6bde851a-f553-11e9-802a-5aa538984bd8'} // uuid v1
			];
			const constraints = {
				test: {
					uuid: 4
				}
			};
			values.forEach((value) => {
				const response = validate(value, constraints);
				assert.strictEqual(response.test[0], 'Test is not a valid uuid');
			});
		});
	});
});
