import DatetimeValidator from '@/validators/datetime';
import moment from 'moment';
import sinon from 'sinon';
import validate from 'validate.js';
import Validator from '@/validators/validator';
import {strict as assert} from 'assert';

describe('DatetimeValidator', () => {
	describe('#constructor', () => {
		let validator, validateStub;

		beforeEach(() => {
			validateStub = sinon.stub();
			validator = new DatetimeValidator(validateStub);
		});

		it('Should be an instanceof Validator.', async () => {
			assert.ok(validator instanceof Validator);
		});

		it('Should be an instanceof DatetimeValidator.', async () => {
			assert.ok(validator instanceof DatetimeValidator);
		});
	});

	describe('#validate', () => {
		let validator;

		beforeEach(() => {
			validator = new DatetimeValidator(validate);
			validator.register();
		});

		it('Should pass for valid values.', async () => {
			const values = [
				{},
				{test: '2019-10-17'},
				{test: '2019-09-22 11:07:08'},
				{test: 1571800067},
				{test: new Date()}
			];
			const constraints = {
				test: {
					datetime: true
				}
			};
			values.forEach((value) => {
				const response = validate(value, constraints);
				assert.strictEqual(response, undefined);
			});
		});

		it('Should fail for invalid values.', async () => {
			const values = [
				{test: 'test123'},
				{test: '2019-13-40'}
			];
			const constraints = {
				test: {
					datetime: true
				}
			};
			values.forEach((value) => {
				const response = validate(value, constraints);
				assert.strictEqual(response.test[0], 'Test must be a valid date');
			});
		});

		it('Should pass for valid dateOnly values.', async () => {
			const values = [
				{test: '2019-10-10'}
			];
			const constraints = {
				test: {
					datetime: {
						dateOnly: true
					}
				}
			};
			values.forEach((value) => {
				const response = validate(value, constraints);
				assert.strictEqual(response, undefined);
			});
		});

		it('Should fail for invalid dateOnly values.', async () => {
			const values = [
				{test: '2019-10-10 12:14:20'},
				{test: 'invalid'}
			];
			const constraints = {
				test: {
					datetime: {
						dateOnly: true,
						earliest: moment.utc().subtract(1, 'years')
					}
				}
			};
			values.forEach((value) => {
				const response = validate(value, constraints);
				assert.strictEqual(response.test[0], 'Test must be a valid date');
			});
		});

		it('Should format earliest or latest error messages appropriately.', async () => {
			const constraints = {
				test: {
					datetime: {
						dateOnly: true,
						earliest: moment.utc().subtract(1, 'year'),
						latest: moment.utc().add(1, 'year')
					}
				},
				test2: {
					datetime: {
						earliest: moment.utc().subtract(1, 'year'),
						latest: moment.utc().add(1, 'year')
					}
				}
			};
			const values = [
				{test: '2010-01-01', test2: '2010-01-01 01:00:00'},
				{test: '3010-01-01', test2: '3010-01-01 01:00:00'}
			];
			values.forEach((value) => {
				const response = validate(value, constraints);
				let date = response.test[0].replace(/^.*than /g, '').slice(0, -1);
				assert.ok(moment(date, 'yyyy-mm-dd').isValid());
				date = response.test2[0].replace(/^.*than /g, '').slice(0, -1);
				assert.ok(moment(date + '', moment.ISO_8601).isValid());
			});
		});
	});
});
