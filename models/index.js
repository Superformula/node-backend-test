let aws = require('aws-sdk');
let db = new aws.DynamoDB();
let dc = new aws.DynamoDB.DocumentClient();

let definitions = require('./defs/index');

module.exports = {
	local: false,

	init(dynamoClient, docClient) {
		db = dynamoClient;
		dc = docClient;
	},

	getDynamoClient() {
		return db;
	},

	getDocumentClient() {
		return dc;
	},

	initForLocal() {
		this.local = true;
		process.env.AWS_ACCESS_KEY_ID = 'SOME_KEY';
		process.env.AWS_SECRET_ACCESS_KEY = 'SOME_SECRET';
		process.env.AWS_REGION = 'us-east-1';

		let host = process.env.DOCKER ? 'dynamo' : 'localhost';
		db = new aws.DynamoDB({
			endpoint: `http://${host}:8000`
		});
		dc = new aws.DynamoDB.DocumentClient({
			endpoint: `http://${host}:8000`
		});
	},

	async dataReset() {
		if (!this.local) {
			return new Error('only available locally');
		}

		// first delete any existing tables
		let tables = await this.dynamoListTables();
		for (let TableName of tables) {
			try {
				await db.deleteTable({TableName}).promise();
			} catch (e) {
				return e;
			}
		}

		// then create fresh versions of them
		for (let def of definitions) {
			try {
				await db.createTable(def).promise();
			} catch (e) {
				return e;
			}
		}

		return null;
	},

	async dynamoListTables() {
		let tables = [];
		let params = {};
		while (true) {
			let resp;
			try {
				resp = await db.listTables(params).promise();
				tables = [...tables, ...resp.TableNames];
			} catch (e) {
				return e;
			}

			if (resp.LastEvaluatedTableName) {
				params.LastEvaluatedTableName = resp.LastEvaluatedTableName;
			} else {
				break;
			}
		}

		return tables;
	},

	async dynamoPut(req, key) {
		if (!req) {
			return new Error('missing request object');
		}
		if (!key || typeof key !== 'object') {
			return new Error('invalid key object');
		}
		if (!req.Item.id) {
			return new Error('item is missing an id');
		}

		// fetch first
		let params = {
			TableName: req.TableName,
			Key: key,
			ConsistentRead: true
		};

		let resp = await dc.get(params).promise();
		let existing = resp.Item;
		if (existing && existing.createdAt !== req.Item.createdAt) {
			return new Error('inconsistent data detected');
		}

		req.Item.createdAt = req.Item.createdAt || new Date().toISOString();
		req.Item.updatedAt = new Date().toISOString();

		try {
			await dc.put(req).promise();
		} catch (e) {
			return e;
		}

		return req.Item;
	},

	async dynamoScan(tableName) {
		let params = {
			TableName: tableName
		};

		try {
			return await dc.scan(params).promise();
		} catch (e) {
			return e;
		}
	},

	async dynamoRead(params) {
		try {
			return await dc.get(params).promise();
		} catch (e) {
			return e;
		}
	},

	async dynamoDelete(req) {
		try {
			return await dc.delete(req).promise();
		} catch (e) {
			return e;
		}
	}
};
