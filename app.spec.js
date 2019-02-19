let assert = require('assert');

let app = require('./app');
let models = require('./models');
let HttpClient = require('./lib/httpClient');

describe('the app', () => {
	models.initForLocal();
	let client = new HttpClient('localhost', 8080);

	after(async () => {
		await client.request('POST', '/exit');
	});

	it('has an  index route', async function () {
		let resp = await client.request('GET', '/');
		let body = JSON.parse(resp.body);
		assert(resp.statusCode === 200);
		assert(body.status === 'ok');
	});

	it('can fetch all users', async function () {
		await models.dataReset();

		let resp = await client.request('GET', '/v1/users');
		assert(resp.statusCode === 200);
		assert(resp.body === '[]');
	});

	it('can post a new user', async function () {
		let user = {
			name: 'bob'
		};

		let resp = await client.request('POST', '/v1/users', user);
	});


});
