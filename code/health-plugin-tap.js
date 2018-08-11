const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await require("./get-test-uri")(require("./server"));
});

tap.test("health route", test => {
  request(uri)
    .get("/health")
    .expect(200)
    .end((error, res) => {
      test.error(error);
      test.match(res.body, {
        version: /\d+\.\d+\.\d+/,
        startTime: /\d{13,}/
      });
      test.end();
    });
});
