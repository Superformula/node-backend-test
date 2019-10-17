// model.js
// Model class - base model class
// contains functionality that is/can be common for all models

const Base = require('./base.js');

const AWS = require('aws-sdk');

let dynamoDb;

class Model extends Base{
    constructor(options = {}) {
        super();

        // init main vars
        this.dynamoDb = false;

        if (options.dynamoDb)
        { // this models needs DynamoDB
            // create a connection if needed, otherwise - reuse
            if (!dynamoDb)
            {
                dynamoDb = new AWS.DynamoDB.DocumentClient();
            }

            this.dynamoDb = dynamoDb;
        }
    }
}

module.exports = Model;
