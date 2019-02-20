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

	it('returns an error if reset has an issue with table operations', async function () {
		await models.dataReset();

		let db = models.getDynamoClient();
		db.deleteTable = () => ({
			promise() {
				throw Error('msg1');
			}
		});

		let result = await models.dataReset();
		assert(result instanceof Error);
		assert(result.message = 'msg1');
		models.initForLocal();

		db = models.getDynamoClient();
		db.createTable = () => ({
			promise() {
				throw Error('msg2');
			}
		});
		result = await models.dataReset();
		assert(result instanceof Error);
		assert(result.message = 'msg2');

		// reset
		models.initForLocal();
	});

	it('returns an error if reset runs without the local flag set', async function () {
		models.local = false;

		let resp = await models.dataReset();
		assert(resp instanceof Error);
		assert(resp.message.includes('only available locally'));

		// reset
		models.initForLocal();
	});

	it('has a put method which handles create and update ops', async function () {
		await models.dataReset();

		let req = {
			TableName: 'users',
			Item: {
				id: 'SOME-UUID',
				name: 'just testing'
			}
		};

		let id = 'SOME-UUID';
		let inserted = await models.dynamoPut(req, {id});
		let iso8601Pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?Z$/;
		assert(inserted.id);
		assert(inserted.name);
		assert(iso8601Pattern.test(inserted.createdAt));
		assert(iso8601Pattern.test(inserted.updatedAt));

		let resp = await models.dynamoScan('users');
		assert(resp.Items.length === 1);
		assert(resp.Items[0].id === 'SOME-UUID');
		assert(resp.Items[0].name === 'just testing');
	});

	it('returns an error on put when updating the same record with a different create timestamp', async function () {
		await models.dataReset();

		let req = {
			TableName: 'users',
			Item: {
				id: 'SOME-UUID',
				name: 'just testing'
			}
		};

		let id = 'SOME-UUID';
		await models.dynamoPut(req, {id});
		let badRecord = JSON.parse(JSON.stringify(req.Item));
		badRecord.createdAt = new Date(2018, 0, 1).toISOString();

		req.Item = badRecord;
		let result = await models.dynamoPut(req, {id});
		assert(result instanceof Error);
		assert(result.message === 'inconsistent data detected');
	});

	it('returns an error on put when there is an issue with the key object', async function () {
		await models.dataReset();
		let req = {
			TableName: 'users',
			Item: {
				id: 'SOME-UUID',
				name: 'just testing'
			}
		};

		let id = 'SOME-UUID';
		let result = await models.dynamoPut(req, id);
		assert(result instanceof Error);
		assert(result.message.includes('invalid key object'));

		result = await models.dynamoPut(req, null);
		assert(result instanceof Error);
		assert(result.message.includes('invalid key object'));
	});

	it('returns an error on put dynamo put fails', async function () {
		await models.dataReset();
		let req = {
			TableName: 'users',
			Item: {
				id: 'SOME-UUID',
				name: 'just testing'
			}
		};

		let id = 'SOME-UUID';
		let dc = models.getDocumentClient();
		dc.put = () => ({
			promise() {
				throw new Error('msg1');
			}
		});

		let result = await models.dynamoPut(req, {id});
		assert(result instanceof Error);
		assert(result.message.includes('msg1'));

		// reset
		models.initForLocal();
	});

	it('returns an error on put when the req obj is missing', async function () {
		await models.dataReset();

		let id = 'SOME-UUID';
		let result = await models.dynamoPut(null, {id});
		assert(result instanceof Error);
		assert(result.message.includes('missing request object'));
	});

	it('returns an error on put when the req obj is missing an id', async function () {
		await models.dataReset();

		let req = {
			TableName: 'users',
			Item: {
				name: 'just testing'
			}
		};

		let id = 'SOME-UUID';
		let result = await models.dynamoPut(req, {id});
		assert(result instanceof Error);
		assert(result.message.includes('item is missing an id'));
	});

	it('has a simple method for listing all tables', async function () {
		await models.dataReset();

		// testing
		// paginated results
		let i = 0;
		let db = models.getDynamoClient();
		db.listTables = () => ({
			promise() {
				i++;
				return i === 1
					? {TableNames: ['one', 'two'], LastEvaluatedTableName: 'two'}
					: {TableNames: ['three']};
			}
		});

		let tables = await models.dynamoListTables();
		assert(tables.length === 3);
		assert(tables.join() === 'one,two,three');

		// testing non paginated result
		models.initForLocal();
		tables = await models.dynamoListTables();
		assert(tables.length === 1);
		assert(tables.join() === 'users');
	});

	it('returns an error if there is an issue with listing tables', async function () {
		await models.dataReset();
		let db = models.getDynamoClient();
		db.listTables = () => ({
			promise() {
				throw new Error('msg1');
			}
		});

		let result = await models.dynamoListTables();
		assert(result instanceof Error);
		assert(result.message.includes('msg1'));

		// reset
		models.initForLocal();
	});

	it('has a simple table scan method which is not recommended for production, just demo', async function () {
		await models.dataReset();
		let req1 = {
			TableName: 'users',
			Item: {
				id: 'SOME-ID-1',
				name: 'for testing'
			}
		};

		let req2 = {
			TableName: 'users',
			Item: {
				id: 'SOME-ID-2',
				name: 'for testing'
			}
		};

		await models.dynamoPut(req1, {id: req1.Item.id});
		await models.dynamoPut(req2, {id: req2.Item.id});

		let resp = await models.dynamoScan('users');
		assert(resp.Items.length === 2);

		let set = new Set(['SOME-ID-1', 'SOME-ID-2']);
		for (let item of resp.Items) {
			set.delete(item.id);
		}
		assert(set.size === 0);
	});

	it('returns an error on issues with table scanning', async function () {
		await models.dataReset();
		let dc = models.getDocumentClient();
		dc.scan = () => ({
			promise() {
				throw new Error('msg1');
			}
		});

		let resp = await models.dynamoScan('someTable');
		assert(resp instanceof Error);
		assert(resp.message.includes('msg1'));

		// reset
		models.initForLocal();
	});

	it('has a read method', async function () {
		await models.dataReset();
		let req = {
			TableName: 'users',
			Item: {
				id: 'SOME-ID-1',
				name: 'for testing'
			}
		};

		let inserted = await models.dynamoPut(req, {id: req.Item.id});
		assert(!(inserted instanceof Error));

		let params = {
			TableName: 'users',
			Key: {id: 'SOME-ID-1'}
		};
		let resp = await models.dynamoRead(params);
		assert(resp.Item.id = 'SOME-ID-1');
		assert(resp.Item.name === 'for testing');
	});

	it('returns on an error on failed reads', async function () {
		await models.dataReset();

		let params = {
			TableName: 'nonexistent',
			Key: {id: 'SOME-ID-1'}
		};


		params.TableName = 'nonexistent';
		let resp = await models.dynamoRead(params);
		assert(resp instanceof Error);
	});

	it('has a delete method', async function () {
		await models.dataReset();

		// add user
		let req = {
			TableName: 'users',
			Item: {
				id: 'SOME-ID-1',
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
				id: 'SOME-ID-1',
			}
		};
		await models.dynamoDelete(req);
		resp = await models.dynamoScan('users');
		assert(resp.Items.length === 0);
	});

	it('returns an error on failed deletes', async function () {
		await models.dataReset();

		let req = {
			TableName: 'nonexistent',
			Key: {
				id: 'SOME-ID-1',
			}
		};

		let resp = await models.dynamoDelete(req);
		assert(resp instanceof Error);
	});
});
