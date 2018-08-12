const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("OpenAPI Swagger Documentation", test => {
  request(uri)
    .get("/documentation")
    .expect(200)
    .expect("Content-Type", "text/html; charset=utf-8")
    .expect(/swagger-ui-container/)
    .expect(/Superformula Back-end Test/)
    .end(error => {
      test.error(error);
      test.end();
    });
});
