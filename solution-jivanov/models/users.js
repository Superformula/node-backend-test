// users.js
// users model class

const uuidv4 = require('uuid/v4');
const validate = require('validate.js');

const Model = require('../lib/model.js');

const ID_VALIDATION_CONSTRAINTS = {
    presence: true, // it is mandatory
    type: 'string', // ID must be of type string, since it is an UUID
    length: {
        is: 36, // and must be exactly 36 chars too
        message: 'The record ID must be exactly 36 chars long'
    },
};
const CREATE_VALIDATION_CONSTRAINTS = {
    name: {
        presence: true, // only name is mandatory
        length: {
            minimum: 3, // and must be at least 3 chars long
            message: 'field is mandatory and must be at least 3 chars long'
        },
    },
    dob: {
        presence: false,
    },
    address: {
        presence: false,
        length: {
            minimum: 2, // and must be at least 2 chars long
            message: 'must be at least 2 chars long'
        },
    },
    description: {
        presence: false,
        length: {
            minimum: 2, // and must be at least 2 chars long
            message: 'must be at least 2 chars long'
        },
    },
};
const UPDATE_VALIDATION_CONSTRAINTS = {
    name: {
        presence: false, // only name is mandatory
        length: {
            minimum: 3, // and must be at least 3 chars long
            message: 'must be at least 3 chars long'
        },
    },
    dob: {
        presence: false,
    },
    address: {
        presence: false,
        length: {
            minimum: 2, // and must be at least 2 chars long
            message: 'must be at least 2 chars long'
        },
    },
    description: {
        presence: false,
        length: {
            minimum: 2, // and must be at least 2 chars long
            message: 'must be at least 2 chars long'
        },
    },
};
const VALIDATION_OPTIONS = {
    format: 'flat', // return "flat" message format i.e. a single string
};

const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME;

// a map to translate input params to DynamoDB ones if needed
const dynamoDbKeys = new Map ([
    ['name', '#userName'],
]);

class Users extends Model {
    constructor() {
        super({dynamoDb: true}); // start with DynamoDB enabled

        if ( !USERS_TABLE_NAME || !Users.isString(USERS_TABLE_NAME) ) throw new Error('No Users table name provided in the YML file');

        // init some vars
        this.itemId = '';
        this.itemData = '';
    }

    validateId(itemId=this.itemId)
    {
        const validated = validate.single(itemId, ID_VALIDATION_CONSTRAINTS);

        if ( validated !== undefined)
        { // validation failed, throw an appropriate message
            throw new Error(validated);
        }

        // we are all good, now we can capture the validated value
        this.itemId = itemId;

        console.log("validated, this.itemId= ", this.itemId);

        return true;
    }

    validateData(itemData=this.itemData, constraints = CREATE_VALIDATION_CONSTRAINTS)
    {
        if (validate.isString(itemData))
        { // parse JSON if needed
            itemData = JSON.parse(itemData);
        }

        itemData = validate.cleanAttributes(itemData, constraints); // clean up the input data, assure it contains only allowed keys
        const validated = validate(itemData, constraints, VALIDATION_OPTIONS);

        if ( validated !== undefined)
        { // validation failed, throw an appropriate message
            throw new Error(validated);
        }

        // validation passed, now we can capture the validated value
        this.itemData = itemData;

        console.log("validated, this.itemData= ", this.itemData);

        return true;
    }

    validateUpdate(itemData=this.itemData, constraints = UPDATE_VALIDATION_CONSTRAINTS)
    {
        return this.validateData(itemData, constraints);
    }

    prepareCreateRequest(itemData=this.itemData) {
        const timestamp = new Date().toISOString();

        this.itemId = uuidv4();

        return {
            TableName: USERS_TABLE_NAME,
            Item: {
                id: this.itemId,
                ...itemData,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };
    }

    async create(itemData=this.itemData) {

        const request = this.prepareCreateRequest(itemData);

        console.log("CREATE, request= ", request);

        await this.dynamoDb.put(request).promise();

        return this.itemId;
    }

    prepareReadRequest(itemId=this.itemId) {
        return {
            TableName: USERS_TABLE_NAME,
            Key: {
                id: itemId,
            }
        };
    }

    async read(itemId=this.itemId) {

        const request = this.prepareReadRequest(itemId);

        console.log("READ, request= ", request);

        const result = await this.dynamoDb.get(request).promise();

        if (result.Item)
        { // item is found, capture the data
            this.itemId = itemId;
            this.itemData = result.Item;
        }
        else
        { // not found, throw an error
            throw new Error(`Can NOT find an item in the database with ID: ${this.itemId}.`);
        }

        return this.itemData;
    }

    prepareUpdateRequest(itemId=this.itemId, itemData=this.itemData) {
        console.log("itemData= ", itemData);

        if (!Users.isObject(itemData)) throw new Error("Please assure you pass the data to update as an object");
        if (Users.isEmptyObject(itemData)) throw new Error("No data to update! Please assure you pass the data you need to update as an object");

        // prepare expression, attributes and names
        let expression = '';
        let attributes = {
            ":updatedAt": new Date().toISOString() // start with the mandatory attribute
        };
        let names = {};
        for (const key of Object.keys(itemData))
        {
            if (dynamoDbKeys.has(key))
            {
                const dbKey = dynamoDbKeys.get(key);
                expression +=  dbKey + ' = :' + key + ',';
                names[dbKey] = key;
            }
            else
            {
                expression += key + ' = :' + key + ',';
            }

            attributes[":" + key] =  itemData[key];
        }

        console.log("expression= ", expression);
        console.log("attributes= ", attributes);

        let request = {
            TableName: USERS_TABLE_NAME,
            Key: {
                id: itemId,
            },
            ConditionExpression: 'attribute_exists(id)',
            UpdateExpression: `SET ${expression} updatedAt = :updatedAt`,
            ExpressionAttributeValues: attributes,
            ReturnValues: "ALL_NEW"
        };
        // add ExpressionAttributeNames if needed
        if (!Users.isEmptyObject(names))
        {
            request['ExpressionAttributeNames'] = names;
        }

        return request;
    }

    async update(itemId=this.itemId, itemData=this.itemData) {

        const request = this.prepareUpdateRequest(itemId, itemData);

        console.log("UPDATE, request= ", request);

        const result = await this.dynamoDb.update(request).promise();

        console.log("result= ", result);

        return this.itemId;
    }

    prepareDeleteRequest(itemId=this.itemId) {
        return {
            TableName: USERS_TABLE_NAME,
            Key: {
                id: itemId,
            },
            ConditionExpression: 'attribute_exists(id)', // assure the record exists, throw an error otherwise
        };
    }

    async delete(itemId=this.itemId) {

        const request = this.prepareDeleteRequest(itemId);

        console.log("DELETE, request= ", request);

        return await this.dynamoDb.delete(request).promise();
    }

    async query() {
        await this.sendSns(this.model.input);
    }


}

module.exports = Users;