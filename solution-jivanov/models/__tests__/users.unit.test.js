const model = require('../users.js');

describe("Testing model users.js class", () => {

    test('constructor() no USERS_TABLE_NAME', () => {
        expect(() => {
            new model();
        }).toThrow('No Users table name provided in the YML file');
    });

});