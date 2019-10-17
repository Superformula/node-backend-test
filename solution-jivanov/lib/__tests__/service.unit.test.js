const service = require('../service.js');

describe("Testing main Service.js class", () => {

    test('constructor()', () => {
        expect(new service).toBeTruthy();
    });

    // response() should return an AWS formatted response
    test('AWS response', () => {
        spyOn(Date.prototype, 'toISOString').and.returnValue("2019-10-14T11:00:00.000Z"); // mocking the current date
        expect(service.response(200,{a:1, b:2}))
            .toEqual({
                "body": "{\"a\":1,\"b\":2,\"timestamp\":\"2019-10-14T11:00:00.000Z\"}",
                "headers": {
                     "Access-Control-Allow-Origin": "*",
                },
                "statusCode": 200
            });
    });

});