const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("OpenAPI Swagger Documentation", async () => {
  await request(uri)
    .get("/documentation")
    .expect(200)
    .expect("Content-Type", "text/html; charset=utf-8")
    .expect(/swagger-ui-container/)
    .expect(/Superformula Back-end Test/);
});
