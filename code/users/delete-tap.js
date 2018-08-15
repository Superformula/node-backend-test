const request = require("supertest");
const tap = require("tap");
const uuid = require("uuid/v4");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("delete user success case", async () => {
  const user = { id: uuid(), name: "Test User Name" };
  await request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(201);
  await request(uri)
    .delete(`/api/v1/users/${user.id}`)
    .expect(200);
  // After delete, GET should respond 404 Not Found
  await request(uri)
    .get(`/api/v1/users/${user.id}`)
    .expect(404);
});

tap.test("delete user not found case", async () => {
  await request(uri)
    .delete(`/api/v1/users/${uuid()}`)
    .expect(404);
});

tap.test("delete user not invalid user id case", async () => {
  await request(uri)
    .delete(`/api/v1/users/${uuid()}FFF`)
    .expect(400);
});
