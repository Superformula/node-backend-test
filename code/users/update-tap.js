const request = require("supertest");
const tap = require("tap");
const uuid = require("uuid/v4");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("update user dense success case", async test => {
  const user = {
    id: uuid(),
    name: "unit-test-name-1",
    address: "unit-test-address-1",
    description: "unit-test-description-1",
    dob: "2018-01-02"
  };
  await request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(201);
  const update = {
    name: "unit-test-name-2",
    address: "unit-test-address-2",
    description: "unit-test-description-2",
    dob: "2018-01-02"
  };
  const res = await request(uri)
    .patch(`/api/v1/users/${user.id}`)
    .send(update)
    .expect(200);
  test.match(res.body, update);
  test.match(res.body, {
    createdAt: /^\d{4}-\d{2}-\d{2}/,
    updatedAt: /^\d{4}-\d{2}-\d{2}/
  });
  test.ok(res.body.updatedAt > res.body.createdAt);
});

tap.test("update user not found case", async () => {
  const user = { id: uuid(), name: "Test Update 1" };
  await request(uri)
    .patch(`/api/v1/users/${user.id}`)
    .send({ name: "Test Update 2" })
    .expect(404);
});

tap.test("update user invalid ID case", async () => {
  await request(uri)
    .patch(`/api/v1/users/${uuid()}FFF`)
    .send({ name: "Test Update 2" })
    .expect(400);
});
