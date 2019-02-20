let assert = require('assert');
let uuid = require('uuid');

let models = require('./models');
let User = require('./models/user');
let HttpClient = require('./lib/httpClient');
let logger = require('./lib/logger');
let metrics = require('./lib/metrics');

describe('the app', () => {
	let client = new HttpClient('localhost', 8080);
	let fixture = {
		id: uuid(),
		name: 'test user',
		dob: '2010-01-01T00:00:00.000Z',
		address: '111 main street',
		description: 'this is a test user',
	};

	before(async function () {
		this.timeout(10000);
		logger.disable();
		process.env.LOCAL = true;
		require('./app');
	});

	after(async () => {
		await client.request('POST', '/exit');
	});

	beforeEach(() => {
		metrics.incrementSave = metrics.increment;
		metrics.recordSave = metrics.record;
		metrics.increment = () => metrics.incrementCalled = true;
		metrics.record = () => metrics.recordCalled = true;
	});

	afterEach(() => {
		assert(metrics.incrementCalled);
		assert(metrics.recordCalled);

		metrics.increment = metrics.incrementSave;
		metrics.record = metrics.recordSave;
		delete metrics.incrementCalled;
		delete metrics.recordCalled;
		delete metrics.incrementSave;
		delete metrics.recordSave;
	});

	it('has an  index route', async function () {
		let resp = await client.request('GET', '/');
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 200);
		assert(body.status === 'ok');
	});

	it('requires auth for most routes', async function () {
		let resp = await client.request('GET', '/v1/users');
		assert(resp.statusCode === 401);

		resp = await client.request('GET', '/v1/users/someId');
		assert(resp.statusCode === 401);

		resp = await client.request('POST', '/v1/users', {});
		assert(resp.statusCode === 401);

		resp = await client.request('PUT', '/v1/users/123', {});
		assert(resp.statusCode === 401);

		resp = await client.request('DELETE', '/v1/users/123');
		assert(resp.statusCode === 401);
	});

	it('can fetch all users', async function () {
		await models.dataReset();

		let u1 = new User(fixture);
		await User.insert(u1);

		let u2 = new User(fixture);
		u2.id = u2.id + 'aaa';
		await User.insert(u2);

		let headers = {Authorization: 'abc'};
		let resp = await client.request('GET', '/v1/users', null, headers);
		let body = JSON.parse(resp.body);
		let ids = new Set([u1.id, u2.id]);
		assert(resp.statusCode === 200);
		assert(body.length === 2);

		for (let item of body) {
			ids.delete(item.id);
		}
		assert(ids.size === 0);
	});

	it('returns 500 on error fetching all users', async function () {
		// error case
		let save = User.getAll;
		User.getAll = () => new Error();
		let headers = {Authorization: 'abc'};
		let resp = await client.request('GET', '/v1/users', null, headers);
		assert(resp.statusCode === 500);

		// restore
		User.getAll = save;
	});

	it('can fetch a single user', async function () {
		let u = new User(fixture);
		let inserted = await User.insert(u);

		let id = u.id;
		let headers = {Authorization: 'abc'};
		let resp = await client.request('GET', `/v1/users/${id}`, null, headers);
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 200);
		for (let k of Object.keys(inserted)) {
			assert(inserted[k] === body[k]);
		}
	});

	it('returns a 404 if the user does not exist', async function () {
		let headers = {Authorization: 'abc'};
		let resp = await client.request('GET', `/v1/users/nonexistent`, null, headers);
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 404);
		assert(body.error.includes('no such user'));
	});

	it('returns 500 on error fetching a single user', async function () {
		let save = User.fetch;
		User.fetch = () => new Error();

		let headers = {Authorization: 'abc'};
		let resp = await client.request('GET', `/v1/users/some-id`, null, headers);
		assert(resp.statusCode === 500);

		// restore
		User.fetch = save;
	});

	it('can post a new user', async function () {
		await models.dataReset();

		let user = new User(fixture);
		let headers = {Authorization: 'abc'};
		let resp = await client.request('POST', '/v1/users', user, headers);
		let inserted = JSON.parse(resp.body);
		let iso8601Pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?Z$/;

		assert(resp.statusCode === 200);
		assert(inserted.id === user.id);
		assert(inserted.name === user.name);
		assert(inserted.dob === user.dob);
		assert(inserted.address === user.address);
		assert(inserted.description === user.description);
		assert(iso8601Pattern.test(inserted.createdAt));
		assert(iso8601Pattern.test(inserted.updatedAt));

		let fetched = User.fetch(inserted.id);
		for (let k of Object.keys(fetched)) {
			assert(fetched[k] === inserted[k]);
		}
	});

	it('rejects invalid data on user post', async function () {
		await models.dataReset();

		let user = new User(fixture);
		delete user.id;

		// id validation
		let headers = {Authorization: 'abc'};
		let resp = await client.request('POST', '/v1/users', user, headers);
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing id'));

		// name validation
		user = new User(fixture);
		delete user.name;
		resp = await client.request('POST', '/v1/users', user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing name'));

		// dob validation
		user = new User(fixture);
		user.dob = 'bad-format';
		resp = await client.request('POST', '/v1/users', user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 2);
		assert(body.error.includes('invalid dob date format'));
		assert(body.error.includes('invalid timezone for dob'));

		// address validation
		user = new User(fixture);
		delete user.address;
		resp = await client.request('POST', '/v1/users', user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing address'));

		// description validation
		user = new User(fixture);
		delete user.description;
		resp = await client.request('POST', '/v1/users', user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing user description'));

		// multiple field errors
		user = new User(fixture);
		delete user.dob;
		delete user.address;
		delete user.description;
		resp = await client.request('POST', '/v1/users', user, headers);
		body = JSON.parse(resp.body);
		assert(body.error.includes('missing dob'));
		assert(body.error.includes('invalid dob date format'));
		assert(body.error.includes('missing address'));
		assert(body.error.includes('missing user description'));
	});

	it('returns 500 on error posting a single user', async function () {
		await models.dataReset();

		let save = User.insert;
		User.insert = () => new Error();

		let user = new User(fixture);
		let headers = {Authorization: 'abc'};
		let resp = await client.request('POST', '/v1/users', user, headers);
		assert(resp.statusCode === 500);

		// restore
		User.insert = save;
	});

	it('can update an existing user', async function () {
		await models.dataReset();

		let user = new User(fixture);
		let inserted = await User.insert(user);

		let headers = {Authorization: 'abc'};
		let changed = JSON.parse(JSON.stringify(inserted));
		changed.name = 'a new name';

		let resp = await client.request('PUT', `/v1/users/${user.id}`, changed, headers);
		let updated = JSON.parse(resp.body);
		let iso8601Pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?Z$/;

		assert(resp.statusCode === 200);
		assert(updated.id === inserted.id);
		assert(updated.name === changed.name);
		assert(updated.dob === inserted.dob);
		assert(updated.address === inserted.address);
		assert(updated.description === inserted.description);
		assert(updated.createdAt === inserted.createdAt);
		assert(updated.updatedAt !== inserted.updatedAt);
		assert(iso8601Pattern.test(updated.createdAt));
		assert(iso8601Pattern.test(updated.updatedAt));

		let fetched = User.fetch(user.id);
		for (let k of Object.keys(fetched)) {
			assert(fetched[k] === updated[k]);
		}
	});

	it('rejects invalid data on user update', async function () {
		await models.dataReset();

		let user = new User(fixture);
		await User.insert(user);

		// id validation
		let headers = {Authorization: 'abc'};
		let resp = await client.request('PUT', '/v1/users/non-existent-id', user, headers);
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.includes('user does not exist'));

		let withMissingId = JSON.parse(JSON.stringify(user));
		delete withMissingId.id;
		resp = await client.request('PUT', `/v1/users/${user.id}`, withMissingId, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.includes('missing id'));

		// name validation
		user = new User(fixture);
		delete user.name;
		resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing name'));

		// dob validation
		user = new User(fixture);
		user.dob = 'bad-format';
		resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 2);
		assert(body.error.includes('invalid dob date format'));
		assert(body.error.includes('invalid timezone for dob'));

		// address validation
		user = new User(fixture);
		delete user.address;
		resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing address'));

		// description validation
		user = new User(fixture);
		delete user.description;
		resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		body = JSON.parse(resp.body);
		assert(resp.statusCode === 400);
		assert(body.error.length === 1);
		assert(body.error.includes('missing user description'));

		// multiple field errors
		user = new User(fixture);
		delete user.dob;
		delete user.address;
		delete user.description;
		resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		body = JSON.parse(resp.body);
		assert(body.error.includes('missing dob'));
		assert(body.error.includes('invalid dob date format'));
		assert(body.error.includes('missing address'));
		assert(body.error.includes('missing user description'));
	});

	it('returns 500 on error updating a single user', async function () {
		await models.dataReset();

		let user = new User(fixture);
		await User.insert(user);

		// error on fetch
		let save = User.fetch;
		User.fetch = () => new Error();
		let headers = {Authorization: 'abc'};
		let resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		assert(resp.statusCode === 500);
		User.fetch = save; // restore

		// error on insert
		save = User.insert;
		User.insert = () => new Error();
		resp = await client.request('PUT', `/v1/users/${user.id}`, user, headers);
		assert(resp.statusCode === 500);
		User.insert = save; // restore
	});

	it('can delete a user', async function () {
		await models.dataReset();

		let user = new User(fixture);
		await User.insert(user);

		let headers = {Authorization: 'abc'};
		let resp = await client.request('GET', `/v1/users/${user.id}`, null, headers);
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 200);
		assert(body.id === user.id);
		assert(body.name === user.name);

		resp = await client.request('DELETE', `/v1/users/${user.id}`, null, headers);
		assert(resp.statusCode === 204);

		let users = await User.getAll();
		assert(users.length === 0);
	});

	it('returns 500 on error deleting a user', async function () {
		await models.dataReset();

		let save = User.delete;
		User.delete = () => new Error();
		let headers = {Authorization: 'abc'};
		let resp = await client.request('DELETE', '/v1/users/some-id', null, headers);
		assert(resp.statusCode === 500);

		// restore
		User.delete = save;
	});
});
