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

	it('will not replace missing values in passed object', () => {
		let o = JSON.parse(JSON.stringify(fixture));
		delete o.id;

		let user = new User(o);
		assert(!user.id);
	});

	it('can be instantiated by passing json', () => {
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

		delete u.id;
		errors = User.validate(u);
		assert(errors.includes('missing id'));

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

	it('returns an error if no user is supplied on create', async function () {
		await models.dataReset();
		let result = await User.insert(null);
		assert(result instanceof Error);
		assert(result.message.includes('missing user'));
	});

	it('returns an error if there is an issue creating the record', async function () {
		await models.dataReset();
		let user = new User(fixture);
		let dc = models.getDocumentClient();
		dc.put = () => ({
			promise() {
				throw new Error('msg1');
			}
		});

		let result = await User.insert(user);
		assert(result instanceof Error);
		assert(result.message.includes('msg1'));

		// reset
		models.initForLocal();
	});

	it('can fetch a user by id', async function () {
		await models.dataReset();

		let u = new User(fixture);
		await User.insert(u);

		let fetched = await User.fetch(u.id);
		assert(fetched.id === u.id);
		assert(fetched.name === u.name);
		assert(fetched.dob === u.dob);
		assert(fetched.address = u.address);
		assert(fetched.description === u.description);
		assert(fetched.createdAt === u.createdAt);
		assert(fetched.updatedAt !== u.updatedAt);
	});

	it('returns an error when there is an issue with fetch', async function () {
		await models.dataReset();
		let dc = models.getDocumentClient();
		dc.get = () => ({
			promise() {
				return new Error('msg1');
			}
		});

		let result = await User.fetch('some-id');
		assert(result instanceof Error);
		assert(result.message.includes('msg1'));

		// reset
		models.initForLocal();
	});

	it('can fetch all users', async function () {
		await models.dataReset();

		let u1 = new User(fixture);
		let u2 = new User(fixture);
		u2.id = uuid();

		await User.insert(u1);
		await User.insert(u2);

		let users = await User.getAll();
		assert(users.length === 2);
		let set = new Set([u1.id, u2.id]);
		for (let u of users) {
			set.delete(u.id);
		}
		assert(set.size === 0);
	});

	it('returns an error when there is an issue with fetching', async function () {
		await models.dataReset();
		let dc = models.getDocumentClient();
		dc.scan = () => ({
			promise() {
				throw new Error('msg1');
			}
		});

		let result = await User.getAll();
		assert(result instanceof Error);
		assert(result.message.includes('msg1'));

		models.initForLocal();
	});

	it('will return null on fetch when nonexistent', async function () {
		await models.dataReset();
		let fetched = await User.fetch('no-such-user-id');
		assert(fetched === null);
	});

	it('can delete a user', async function () {
		await models.dataReset();

		let u = new User(fixture);
		await User.insert(u);

		let result = await User.delete(u.id);
		assert(!(result instanceof Error));
	});

	it('returns an error if issue with delete', async function () {
		await models.dataReset();
		let dc = models.getDocumentClient();
		dc.delete = () => ({
			promise() {
				throw new Error('msg1');
			}
		});

		let result = await User.delete('some-id');
		assert(result instanceof Error);
		assert(result.message.includes('msg1'));

		// reset
		models.initForLocal();
	});


});
