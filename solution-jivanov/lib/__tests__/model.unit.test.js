const model = require('../model.js');

describe("Testing main Model.js class", () => {

    test('constructor()', () => {
        const obj = new model();
        expect(obj.dynamoDb).toBe(false);
    });

    test('constructor() with DynamoDB', () => {
        const obj = new model({dynamoDb:true});
        expect(obj.dynamoDb).not.toBe(false);
    });

});