import Address from '@/models/address';
import Model from '@/models/model';
import {strict as assert} from 'assert';

describe('Address', () => {
	let address;

	beforeEach(() => {
		address = new Address();
	});

	describe('#constructor', () => {
		it('Should be an instanceof Model.', async () => {
			assert.ok(address instanceof Model);
		});

		it('Should be an instanceof Address.', async () => {
			assert.ok(address instanceof Address);
		});
	});

	describe('#populate', () => {
		it('Should populate attributes.', async () => {
			const data = {
				street: '1234 Testing St',
				city: 'Testing',
				state: 'CA',
				zip: '90210'
			};
			address.populate(data);
			assert.strictEqual(address.street, '1234 Testing St');
			assert.strictEqual(address.city, 'Testing');
			assert.strictEqual(address.state, 'CA');
			assert.strictEqual(address.zip, '90210');
		});
	});

	describe('#validate', () => {
		const assertInvalid = async (param, value, message) => {
			address[param] = value;
			await address.validate().then(() => {
				this.ok = false;
			}).catch(err => {
				assert.strictEqual(err.detail, message);
			});
		};

		const assertValid = async (param, value) => {
			address[param] = value;
			await address.validate().then(response => {
				assert.equal(response[param], value);
			}).catch(() => {
				this.ok = false;
			});
		};

		it('Should validate street.', async () => {
			await assertInvalid('street', false, 'Street must be of type string');
			await assertValid('street', undefined);
			await assertValid('street', '9876 Unit Drive');
		});

		it('Should validate city.', async () => {
			await assertInvalid('city', 123, 'City must be of type string');
			await assertValid('city', undefined);
			await assertValid('city', 'Austin');
		});

		it('Should validate state.', async () => {
			await assertInvalid('state', {}, 'State must be of type string');
			await assertValid('state', undefined);
			await assertValid('state', 'TX');
		});

		it('Should validate zip.', async () => {
			await assertInvalid('zip', [], 'Zip must be of type string');
			await assertValid('zip', undefined);
			await assertValid('zip', '12345');
		});
	});
});
