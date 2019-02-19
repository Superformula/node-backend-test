let assert = require('assert');
let uuid = require('uuid/v4');

let models = require('./index');
let User = require('./user');

describe('user model', function () {
	models.initForLocal();

	let fixture = {
		id: uuid(),
		name: 'test user',
		dob: '2010-01-01T00:00:00.000Z',
		address: '111 main street',
		description: 'this is a test user',
		createdAt: '2019-01-01T00:00:000Z',
		updatedAt: '2019-01-01T00:00:000Z'
	};

	it('has some basic properties', () => {
		let u = new User();
		let keys = Object.keys(u);
		Object.keys(fixture).forEach(
			k => assert(keys.includes(k)));
	});

	it('has a uuid generated on instantiation', () => {
		let u = new User();
		let pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		assert(pattern.test(u.id));
	});

	it('can be instantiated by passing an object', () => {
		let u = new User(fixture);
		Object.keys(u).forEach(
			k => assert(u[k] === fixture[k]));
		Object.keys(fixture).forEach(
			k => assert(fixture[k] === u[k]));
	});

	it('can be instantiated by pass json', () => {
		let json = JSON.stringify(fixture);
		let u = new User(json);
		Object.keys(u).forEach(
			k => assert(u[k] === fixture[k]));
		Object.keys(fixture).forEach(
			k => assert(fixture[k] === u[k]));
	});

	it('can be cloned by passing another user during instantiation', () => {
		let u1 = new User(fixture);
		let u2 = new User(u1);
		Object.keys(u1).forEach(
			k => assert(u1[k] === u2[k]));
		Object.keys(u2).forEach(
			k => assert(u2[k] === u1[k]));
	});

	it('will not append any props passed during instantiation ' +
		'that are not part of the defined schema', () => {
		let clone = JSON.parse(JSON.stringify(fixture));
		clone.notPartOfSchema = 111;
		let u = new User(clone);
		assert(u.notPartOfSchema === undefined);
	});

	it('can validate its id', () => {
		let u = new User(fixture);
		u.id = 'FAKE-UUID';
		let errors = User.validate(u);
		assert(errors.includes('invalid id'));

		u.id = uuid();
		errors = User.validate(u);
		assert(errors === null);
	});

	it('can validate its name', () => {
		let u = new User(fixture);
		u.name = '';

		let errors = User.validate(u);
		assert(errors.includes('missing name'));
	});

	it('can validate its dob', () => {
		let u = new User(fixture);
		u.dob = 'bad-date';

		let errors = User.validate(u);
		assert(errors.includes('invalid dob date format'));

		u.dob = '';
		errors = User.validate(u);
		assert(errors.includes('missing dob'));

		// not utc
		u.dob = '2019-01-01T00:00:00.000';
		errors = User.validate(u);
		assert(errors.includes('invalid timezone for dob'));
	});

	it('can validate its address', () => {
		let u = new User(fixture);
		u.address = '';

		let errors = User.validate(u);
		assert(errors.includes('missing address'));

		u.address = 'some address';
		errors = User.validate(u);
		assert(errors === null);
	});

	it('can validate its description', () => {
		let u = new User(fixture);
		u.description = '';

		let errors = User.validate(u);
		assert(errors.includes('missing user description'));

		u.description = 'some desc';
		errors = User.validate(u);
		assert(errors === null);
	});

	it('can create a user record in dynamo', async function () {
		await models.dataReset();

		let u = new User(fixture);
		u.id = uuid();

		let inserted = await User.insert(u);
		assert(!(inserted instanceof Error));
		assert(inserted.createdAt === fixture.createdAt);
		assert(inserted.updatedAt !== fixture.updatedAt);
	});

	it('can fetch a user by id', async function () {
		await models.dataReset();

		let u = new User(fixture);
		u.id = 'FAKE-UUID';
		

	});


});
