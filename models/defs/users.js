module.exports = {
	TableName: 'users',
	AttributeDefinitions: [
		{
			AttributeName: 'id',
			AttributeType: 'S'
		},
	],
	KeySchema: [
		{
			AttributeName: 'id',
			KeyType: 'HASH'
		}
	],
	ProvisionedThroughput:{
		ReadCapacityUnits: 1000,
		WriteCapacityUnits: 1000
	}
};
