const request = require("supertest");
const tap = require("tap");
const uuid = require("uuid/v4");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("update user success case", async test => {
  const user = { id: uuid(), name: "Test Update 1" };
  await request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(201);
  const res = await request(uri)
    .patch(`/api/v1/users/${user.id}`)
    .send({ name: "Test Update 2" })
    .expect(200);
  test.match(res.body, {
    name: "Test Update 2",
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
