import Address from '@/models/address';
import DatetimeValidator from '@/validators/datetime';
import Model from '@/models/model';
import moment from 'moment';
import sinon from 'sinon';
import User from '@/models/user';
import uuid from 'uuid';
import UuidValidator from '@/validators/uuid';
import {strict as assert} from 'assert';

describe('User', () => {
	let user, momentMock, uuidMock;

	beforeEach(() => {
		user = new User({name: 'test'});
		momentMock = sinon.mock(moment);
		uuidMock = sinon.mock(uuid);
	});

	afterEach(() => {
		momentMock.restore();
		uuidMock.restore();
	});

	describe('#constructor', () => {
		it('Should be an instanceof Model.', async () => {
			assert.ok(user instanceof Model);
		});

		it('Should be an instanceof User.', async () => {
			assert.ok(user instanceof User);
		});
	});

	describe('#populate', () => {
		it('Should generate an id.', async () => {
			uuidMock.expects('v4').once().returns('9835e9e9-bb80-4ab0-829f-5de91f6dd056');
			user = new User();
			uuidMock.verify();
			assert.strictEqual(user.id, '9835e9e9-bb80-4ab0-829f-5de91f6dd056');
		});

		it('Should create default address.', async () => {
			assert.ok(user.address instanceof Address);
		});

		it('Should transform address.', async () => {
			const data = {
				address: {
					city: 'Lincoln',
					state: 'NE'
				}
			};
			user.populate(data);
			assert.ok(user.address instanceof Address);
			assert.strictEqual(user.address.city, 'Lincoln');
		});

		it('Should create default createdAt and updatedAt.', async () => {
			momentMock.expects('utc').atLeast(2).returns({
				toISOString() {
					return '2019-10-22T03:04:29.000Z';
				}
			});
			user = new User();
			momentMock.verify();
			assert.strictEqual(user.createdAt, '2019-10-22T03:04:29.000Z');
			assert.strictEqual(user.updatedAt, '2019-10-22T03:04:29.000Z');
		});
	});

	describe('#validate', () => {
		const assertInvalid = async (param, value, message) => {
			user[param] = value;
			await user.validate().then(() => {
				this.ok = false;
			}).catch(err => {
				assert.strictEqual(err.detail, message);
			});
		};

		const assertValid = async (param, value) => {
			user[param] = value;
			await user.validate().then(response => {
				assert.equal(response[param], value);
			}).catch(() => {
				this.ok = false;
			});
		};

		it('Should register custom validators.', async () => {
			const datetimeRegister = sinon.spy(DatetimeValidator.prototype, 'register');
			const uuidRegister = sinon.spy(UuidValidator.prototype, 'register');
			await user.validate();
			datetimeRegister.restore();
			uuidRegister.restore();
			sinon.assert.calledOnce(datetimeRegister);
			sinon.assert.calledOnce(uuidRegister);
		});

		it('Should validate uuid.', async () => {
			await assertInvalid('id', undefined, 'Id can\'t be blank');
			await assertInvalid('id', 123, 'Id must be of type string');
			await assertInvalid('id', 'not-valid-uuid', 'Id is not a valid uuid');
			await assertValid('id', 'd28e24d1-1928-43cb-b1a9-e323dcc7b2cf');
		});

		it('Should validate name.', async () => {
			await assertInvalid('name', undefined, 'Name can\'t be blank');
			await assertInvalid('name', 123, 'Name must be of type string');
			await assertValid('name', 'Sally');
		});

		it('Should validate dob.', async () => {
			await assertInvalid('dob', 123456, 'Dob must be a valid date');
			await assertValid('dob', undefined);
			await assertValid('dob', '1988-10-12');
		});

		it('Should validate address.', async () => {
			await assertInvalid('address', '1234 testing street', 'Address must be of the correct type');
			await assertValid('address', undefined);
			await assertValid('address', new Address());
		});

		it('Should validate description.', async () => {
			await assertInvalid('description', {}, 'Description must be of type string');
			await assertValid('description', undefined);
			await assertValid('description', 'This user is pretty ok.');
		});

		it('Should validate createdAt.', async () => {
			await assertInvalid('createdAt', 'invalid', 'Created at must be a valid date');
			await assertInvalid('createdAt', undefined, 'Created at can\'t be blank');
			await assertValid('createdAt', '2019-09-10');
			await assertValid('createdAt', '2019-10-22T03:04:29.000Z');
			await assertValid('createdAt', 1571719713);
		});

		it('Should validate updatedAt.', async () => {
			await assertInvalid('updatedAt', 'invalid', 'Updated at must be a valid date');
			await assertInvalid('updatedAt', undefined, 'Updated at can\'t be blank');
			await assertValid('updatedAt', '2019-09-10');
			await assertValid('updatedAt', '2019-10-22T03:04:29.000Z');
			await assertValid('updatedAt', 1571719713);
		});
	});
});
