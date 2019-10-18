describe("Testing model users.js class", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // this is important - it clears the cache (for the next modules)
        process.env = { ...OLD_ENV };
        delete process.env.NODE_ENV;
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('constructor() no USERS_TABLE_NAME', () => {
        const model = require('../users.js');
        expect(() => {
            new model();
        }).toThrow('No Users table name provided in the YML file');
    });

    test('constructor() with DB init', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const model = require('../users.js');
        const obj = new model();
        expect(obj.dynamoDb).not.toBe(false);
        expect(obj.itemId).toBe('');
        expect(obj.itemData).toBe('');
    });

    test('validateId with invalid value', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = 'invalid';
        const model = require('../users.js');
        const obj = new model();

        expect(() => {
            obj.validateId(testValue);
        }).toThrow();
    });

    test('validateId with valid ID', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = 'this-is-a-test-value-for-record-uuid';
        const model = require('../users.js');
        const obj = new model();

        expect(obj.validateId(testValue)).toBe(true);
        expect(obj.itemId).toBe(testValue);
    });

    test('validateData with invalid JSON', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = 'invalid';
        const model = require('../users.js');
        const obj = new model();

        expect(() => {
            obj.validateData(testValue);
        }).toThrow();
    });

    test('validateData with valid JSON, invalid data', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = '{"valid":"json"}';
        const model = require('../users.js');
        const obj = new model();

        expect(() => {
            obj.validateData(testValue);
        }).toThrow();
    });

    test('validateData with valid JSON, valid data, missing name', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = '{"dob":"1970-07-17", "address": "Mandalay Bay Blvd 17", "description":"This is a test user"}';
        const model = require('../users.js');
        const obj = new model();

        expect(() => {
            obj.validateData(testValue);
        }).toThrow();
    });

    test('validateData with valid JSON & valid data', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = '{"name": "TEST User 7", "dob":"1970-07-17", "address": "Mandalay Bay Blvd 17", "description":"This is a test user", "key":"to_be_removed"}';
        const expectedValue = {name: "TEST User 7", dob: "1970-07-17", address: "Mandalay Bay Blvd 17", description: "This is a test user"};
        const model = require('../users.js');
        const obj = new model();

        expect(obj.validateData(testValue)).toBe(true);
        expect(obj.itemData).toEqual(expectedValue);
    });

    test('validateUpdate with invalid JSON', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = 'invalid';
        const model = require('../users.js');
        const obj = new model();

        expect(() => {
            obj.validateUpdate(testValue);
        }).toThrow();
    });

    test('validateUpdate with valid JSON, invalid data', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = '{"valid":"json"}';
        const expectedValue = {};
        const model = require('../users.js');
        const obj = new model();

        expect(obj.validateUpdate(testValue)).toBe(true);
        expect(obj.itemData).toEqual(expectedValue);
    });

    test('validateUpdate with valid JSON, valid data, missing name', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = '{"dob":"1970-07-17", "address": "Mandalay Bay Blvd 17", "description":"This is a test user", "key":"to_be_removed"}';
        const expectedValue = {dob: "1970-07-17", address: "Mandalay Bay Blvd 17", description: "This is a test user"};
        const model = require('../users.js');
        const obj = new model();

        expect(obj.validateUpdate(testValue)).toBe(true);
        expect(obj.itemData).toEqual(expectedValue);
    });

    test('validateUpdate with valid JSON & valid data', () => {
        process.env.USERS_TABLE_NAME = 'users-test';

        const testValue = '{"name": "TEST User 7", "dob":"1970-07-17", "address": "Mandalay Bay Blvd 17", "description":"This is a test user", "key":"to_be_removed"}';
        const expectedValue = {name: "TEST User 7", dob: "1970-07-17", address: "Mandalay Bay Blvd 17", description: "This is a test user"};
        const model = require('../users.js');
        const obj = new model();

        expect(obj.validateUpdate(testValue)).toBe(true);
        expect(obj.itemData).toEqual(expectedValue);
    });

});