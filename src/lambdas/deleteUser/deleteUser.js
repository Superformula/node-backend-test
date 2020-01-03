const DynamoDB = require('aws-sdk/clients/dynamodb');
const db = new DynamoDB.DocumentClient();
const clone = require('clone');
const Log = require('@dazn/lambda-powertools-logger');
const TABLE_NAME = process.env.TABLE_NAME || '';

module.exports.handler = async event => {
    try {
        const { id: userId } = event.pathParameters || {};
        if (!userId) throw 'no user id';

        // get item to delete
        const originalParams = { TableName: TABLE_NAME, Key: { pk: userId, sk: `USER` } };
        const doc = await db.get(originalParams).promise();
        const { Item } = doc;
        if (!Item) throw 'user does not exist';

        // clone a backup item
        const backupItem = clone(Item);
        backupItem.sk = 'DELETED_USER';
        backupItem.updatedAt = new Date().toISOString();

        // store the backup
        const backupParams = { TableName: TABLE_NAME, Item: backupItem };
        await db.put(backupParams).promise();

        //  delete the original
        await db.delete(originalParams).promise();

        // cloudwatch log
        Log.info('User Deleted', { userId });

        // respond success
        return httpResponse(204);
    } catch (err) {
        Log.error('User Delete Error', new Error(err));
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
