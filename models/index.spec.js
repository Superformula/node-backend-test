let assert = require('assert');
let models = require('./index');

describe('models api', () => {
	it('has an init to inject a dynamo client and doc client', () => {
		let db = () => 111;
		let dc = () => 222;

		models.init(db, dc);
		let _db = models.getDynamoClient();
		let _dc = models.getDocumentClient();

		assert(_db() === 111);
		assert(_dc() === 222);
	});

	it('can be initialized for local runs', () => {
		models.initForLocal();

		assert(models.local);
		assert(process.env.AWS_ACCESS_KEY_ID);
		assert(process.env.AWS_SECRET_ACCESS_KEY);
		assert(process.env.AWS_REGION);

		let db = models.getDynamoClient();
		let dc = models.getDocumentClient();

		let host = process.env.DOCKER ? 'dynamo' : 'localhost';
		assert(db.endpoint.href === `http://${host}:8000/`);
		assert(dc.options.endpoint === `http://${host}:8000`);
	});

	it('can perform a data reset for local testing', async function () {
		let err = await models.dataReset();
		assert(!err);

		let tables = await models.dynamoListTables();
		assert(tables.length === 1);
		assert(tables.includes('users'));
	});

	it('has a put method which handles create and update ops', async function () {
		await models.dataReset();

		let req = {
			TableName: 'users',
			Item: {
				id: 'FAKE-UUID',
				name: 'just testing'
			}
		};

		let id = 'FAKE-UUID';
		let inserted = await models.dynamoPut(req, {id});
		let iso8601Pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?Z$/;
		assert(inserted.id);
		assert(inserted.name);
		assert(iso8601Pattern.test(inserted.createdAt));
		assert(iso8601Pattern.test(inserted.updatedAt));

		let resp = await models.dynamoScan('users');
		assert(resp.Items.length === 1);
		assert(resp.Items[0].id === 'FAKE-UUID');
		assert(resp.Items[0].name === 'just testing');
	});

	it('will stop you from updating the same record with a different create timestamp', async function () {
		await models.dataReset();

		let req = {
			TableName: 'users',
			Item: {
				id: 'FAKE-UUID',
				name: 'just testing'
			}
		};

		let id = 'FAKE-UUID';
		await models.dynamoPut(req, {id});
		let badRecord = JSON.parse(JSON.stringify(req.Item));
		badRecord.createdAt = new Date(2018, 0, 1).toISOString();

		req.Item = badRecord;
		let result = await models.dynamoPut(req, {id});
		assert(result instanceof Error);
		assert(result.message === 'inconsistent data detected');
	});

	it('has a simple scan method which is not recommended for production', async function () {
		await models.dataReset();
		let req1 = {
			TableName: 'users',
			Item: {
				id: 'FAKE-ID-1',
				name: 'for testing'
			}
		};

		let req2 = {
			TableName: 'users',
			Item: {
				id: 'FAKE-ID-2',
				name: 'for testing'
			}
		};

		await models.dynamoPut(req1, {id: req1.Item.id});
		await models.dynamoPut(req2, {id: req2.Item.id});

		let resp = await models.dynamoScan('users');
		assert(resp.Items.length === 2);

		let set = new Set(['FAKE-ID-1', 'FAKE-ID-2']);
		for (let item of resp.Items) {
			set.delete(item.id);
		}
		assert(set.size === 0);
	});

	it('has a read method', async function () {
		await models.dataReset();
		let req = {
			TableName: 'users',
			Item: {
				id: 'FAKE-ID-1',
				name: 'for testing'
			}
		};

		let inserted = await models.dynamoPut(req, {id: req.Item.id});
		assert(!(inserted instanceof Error));

		let params = {
			TableName: 'users',
			Key: {id: 'FAKE-ID-1'}
		};
		let resp = await models.dynamoRead(params);
		assert(resp.Item.id = 'FAKE-ID-1');
		assert(resp.Item.name === 'for testing');

		// error case
		params.TableName = 'nonexistent';
		resp = await models.dynamoRead(params);
		assert(resp instanceof Error);
	});

	it('has a delete method', async function () {
		await models.dataReset();

		// add user
		let req = {
			TableName: 'users',
			Item: {
				id: 'FAKE-ID-1',
				name: 'for testing'
			}
		};
		await models.dynamoPut(req, {id: req.Item.id});
		let resp = await models.dynamoScan('users');
		assert(resp.Items.length === 1);

		// delete user
		req = {
			TableName: 'users',
			Key: {
				id: 'FAKE-ID-1',
			}
		};
		await models.dynamoDelete(req);
		resp = await models.dynamoScan('users');
		assert(resp.Items.length === 0);

		// error case
		req = {
			TableName: 'nonexistent',
			Key: {
				id: 'FAKE-ID-1',
			}
		};

		resp = await models.dynamoDelete(req);
		assert(resp instanceof Error);
	});
});
