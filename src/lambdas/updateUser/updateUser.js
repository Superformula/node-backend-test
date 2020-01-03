const DynamoDB = require('aws-sdk/clients/dynamodb');
const db = new DynamoDB.DocumentClient();
const Log = require('@dazn/lambda-powertools-logger');
const cleanDeep = require('clean-deep');
const merge = require('lodash.merge');
const TABLE_NAME = process.env.TABLE_NAME || '';

module.exports.handler = async event => {
    try {
        // get user id from path
        const { id: userId } = event.pathParameters || {};
        if (!userId) throw 'no user id';

        // get data from event.body
        if (!event.body) throw 'no body received';
        const incomingValues = typeof event.body === 'object' ? event.body : JSON.parse(event.body);

        // check if new values were passed in
        if (!Object.keys(incomingValues).length) throw 'no data received';

        // get current user item from db
        const params = { TableName: TABLE_NAME, Key: { pk: userId, sk: `USER` } };
        const doc = await db.get(params).promise();
        const { Item: currentValues } = doc;
        if (!currentValues) throw 'cannot update. user does not exist';

        // deep merge incoming values into existing item values
        const incomingMerged = merge(currentValues, incomingValues);

        // extract for composite state#city#zip
        const { city, state, zip } = incomingMerged.address;
        const scz = `${state}#${city}#${zip}`.toLowerCase().replace(/\s/g, '');

        // spread in system computed values
        const computedValues = {
            updatedAt: new Date().toISOString(),
            scz,
        };
        const computedMerged = { ...incomingMerged, ...computedValues };

        // store the new user item
        const updateParams = {
            TableName: TABLE_NAME,
            Item: cleanDeep(computedMerged),
        };
        await db.put(updateParams).promise();

        // cloudwatch log
        Log.info('User Updated', { userId });

        // respond success
        return httpResponse(204);
    } catch (err) {
        Log.error('User Create Error', new Error(err));
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
