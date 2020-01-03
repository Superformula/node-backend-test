const DynamoDB = require('aws-sdk/clients/dynamodb');
const db = new DynamoDB.DocumentClient();
const Log = require('@dazn/lambda-powertools-logger');
const TABLE_NAME = process.env.TABLE_NAME || '';

module.exports.handler = async event => {
    try {
        const { id: userId } = event.pathParameters || {};
        if (!userId) throw 'no user id';

        // get user item from db
        const params = {
            TableName: TABLE_NAME,
            Key: { pk: userId, sk: `USER` },
            ProjectionExpression: 'pk, #name, address, dob, description',
            ExpressionAttributeNames: { '#name': 'name' },
        };
        const doc = await db.get(params).promise();
        const { Item } = doc;

        // check if data was returned
        if (!Item) throw 'user does not exist';

        // rename pk to id to fit API spec
        const { pk: id, ...rest } = Item;
        const returnDoc = { id, ...rest };

        // respond success
        return httpResponse(200, returnDoc);
    } catch (err) {
        Log.error('User Read Error', new Error(err));
        return httpResponse(400, err);
    }
};

const httpResponse = (statusCode, body) => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: body ? JSON.stringify(body) : undefined,
    };
};
