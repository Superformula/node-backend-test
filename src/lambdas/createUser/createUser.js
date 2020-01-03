const DynamoDB = require('aws-sdk/clients/dynamodb');
const db = new DynamoDB.DocumentClient();
const Log = require('@dazn/lambda-powertools-logger');
const cleanDeep = require('clean-deep');
const TABLE_NAME = process.env.TABLE_NAME || '';

module.exports.handler = async (event, context) => {
    try {
        // get data from event.body
        if (!event.body) throw 'no body received';
        const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body);

        // Get UUID for user id from the lambda request id
        const userId = context.awsRequestId;

        // current time
        const timeNow = new Date().toISOString();

        // extract for composite state#city#zip
        const { city, state, zip } = item.address;
        const scz = `${state}#${city}#${zip}`.toLowerCase().replace(/\s/g, '');

        // system computed values
        const computedValues = {
            pk: userId,
            sk: `USER`,
            createdAt: timeNow,
            updatedAt: timeNow,
            scz,
        };

        // spread computed values over passed in values
        const combinedItems = { ...item, ...computedValues };

        // store the new user item
        const params = {
            TableName: TABLE_NAME,
            Item: cleanDeep(combinedItems),
            ConditionExpression: 'attribute_not_exists(sk)', // disallow overwrite
        };
        await db.put(params).promise();

        // cloudwatch log
        Log.info('User Created', { userId });

        // respond success
        return httpResponse(201, { id: userId });
    } catch (err) {
        // dynamo did not store because the record already exists
        if (err.code === 'ConditionalCheckFailedException') {
            return httpResponse(409, 'a user with this ID already exists');
        }

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
