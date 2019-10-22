import Model from '@/models/model';
import sinon from 'sinon';
import validate from 'validate.js';
import Validator from '@/validators/validator';
import InvalidAttributeException from '@/exceptions/invalid-attribute';
import {strict as assert} from 'assert';

describe('Model', () => {
	let model;

	beforeEach(() => {
		model = new Model();
	});

	describe('#constructor', () => {
		it('Should be an instanceof Model.', async () => {
			assert.ok(model instanceof Model);
		});
	});

	describe('#populate', () => {
		it('Should not populate data that isn\'t expected in attributes().', async () => {
			const data = {
				test1: 'value1',
				test2: 123,
				test3: {}
			};
			model.populate(data);
			assert.strictEqual(model.test1, undefined);
			assert.strictEqual(model.test2, undefined);
			assert.strictEqual(model.test3, undefined);
		});

		it('Should populate data where attribute key exists.', async () => {
			model.attributes = () => {
				return {
					test1: {},
					test2: {},
					test3: {}
				};
			};
			const data = {
				test1: 'value1',
				test2: 123,
				test3: {}
			};
			model.populate(data);
			assert.strictEqual(model.test1, 'value1');
			assert.strictEqual(model.test2, 123);
			assert.strictEqual(model.test3, data.test3);
		});

		it('Should override data already set on the Model.', async () => {
			model.attributes = () => {
				return {
					test1: {}
				};
			};
			model.test1 = 'test';
			assert.strictEqual(model.test1, 'test');
			model.populate({test1: 'changed'});
			assert.strictEqual(model.test1, 'changed');
		});

		it('Should set a defaultValue.', async () => {
			model.attributes = () => {
				return {
					test1: {
						defaultValue: 'a-default-value'
					}
				};
			};
			model.populate({});
			assert.strictEqual(model.test1, 'a-default-value');
		});

		it('Should set a defaultValue that is a function.', async () => {
			model.attributes = () => {
				return {
					test1: {
						defaultValue() {
							return 'something-generated';
						}
					}
				};
			};
			model.populate({});
			assert.strictEqual(model.test1, 'something-generated');
		});

		it('Should transform a value.', async () => {
			model.attributes = () => {
				return {
					test1: {
						transform(value) {
							return value + 5;
						}
					}
				};
			};
			model.populate({test1: 3});
			assert.strictEqual(model.test1, 8);
		});

		it('Should not populate data when userInput is false.', async () => {
			model.attributes = () => {
				return {
					test1: {
						userInput: false
					}
				};
			};
			model.populate({test1: 'input'});
			assert.strictEqual(model.test1, undefined);
		});
	});

	describe('#validate', () => {
		let validateMock;

		beforeEach(() => {
			validateMock = sinon.mock(validate);
		});

		afterEach(() => {
			validateMock.restore();
		});

		it('Should register custom validators.', async () => {
			const register = sinon.spy(Validator.prototype, 'register');
			model.validators = (validate) => {
				return [
					new Validator(validate)
				];
			};
			await model.validate();
			register.restore();
			sinon.assert.calledOnce(register);
		});

		it('Should delete defaultValue from constraints.', async () => {
			validateMock.expects('async').once().withArgs({test1: 'default-value'}, {test1: {}}).returns(Promise.resolve());
			model.attributes = () => {
				return {
					test1: {
						defaultValue: 'default-value'
					}
				};
			};
			model.populate({});
			await model.validate();
			validateMock.verify();
		});

		it('Should delete transform from constraints.', async () => {
			validateMock.expects('async').once().withArgs({test1: null}, {test1: {}}).returns(Promise.resolve());
			model.attributes = () => {
				return {
					test1: {
						transform() {
							return 'transformed-value';
						}
					}
				};
			};
			await model.validate();
			validateMock.verify();
		});

		it('Should delete userInput from constraints.', async () => {
			validateMock.expects('async').once().withArgs({test1: null}, {test1: {}}).returns(Promise.resolve());
			model.attributes = () => {
				return {
					test1: {
						userInput: false
					}
				};
			};
			await model.validate();
			validateMock.verify();
		});

		it('Should reject with InvalidAttributeException when validation errors are an array.', async () => {
			validateMock.expects('async').once().returns(Promise.reject({field: ['An Error Occurred.']}));
			model.validate().catch(err => {
				assert.ok(err instanceof InvalidAttributeException);
			});
		});

		it('Should reject with InvalidAttributeException when validation errors are a string.', async () => {
			validateMock.expects('async').once().returns(Promise.reject({field: 'An Error Occurred.'}));
			model.validate().catch(err => {
				assert.ok(err instanceof InvalidAttributeException);
			});
		});
	});
});
