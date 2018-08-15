const request = require("supertest");
const tap = require("tap");
const uuid = require("uuid/v4");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("get user dense base case", async test => {
  const user = {
    id: uuid(),
    name: "unit-test-name",
    address: "unit-test-address",
    dob: new Date().toISOString(),
    description: "unit-test-description"
  };
  await request(uri)
    .post("/api/v1/users")
    .send(user);
  const res = await request(uri)
    .get(`/api/v1/users/${user.id}`)
    .expect(200);
  test.match(res.body, user);
});

tap.test("get user not found case", async () => {
  await request(uri)
    .get(`/api/v1/users/${uuid()}`)
    .expect(404);
});

tap.test("get user invalid userId case", async () => {
  await request(uri)
    .get(`/api/v1/users/${uuid()}FFF`)
    .expect(400);
});
