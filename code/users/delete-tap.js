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
/*
tap.test("create user duplicate ID", async test => {
  const user = { id: uuid(), name: "Test Duplicate" };
  await request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(201);
  const res = await request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(409);
  test.match(res.body, {
    error: "Conflict",
    message: "A user with that id already exists"
  });
  test.end();
});

function validUser() {
  return { id: uuid(), name: "Test User Name" };
}

const requiredProperties = ["id", "name"];
const invalids = [{}, [], "this is not JSON"];
requiredProperties.forEach(property => {
  const user = validUser();
  delete user[property];
  invalids.push(user);
});

// the zero "all balls" uuid is invalid
let user = validUser();
user.id = "00000000-0000-0000-0000-00000000";
invalids.push(user);

// name too  long
user = validUser();
user.name = "A".repeat(101);
invalids.push(user);

invalids.forEach(body => {
  tap.test("create user invalid payload", test => {
    request(uri)
      .post("/api/v1/users")
      .send(body)
      .expect(400)
      .end((error, res) => {
        test.error(error);
        test.match(res.body, {
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid request payload input"
        });
        test.end();
      });
  });
});
*/
