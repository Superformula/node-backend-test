const request = require("supertest");
const tap = require("tap");
const uuid = require("uuid/v4");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("create user dense success case", test => {
  const user = {
    id: uuid(),
    name: "unit-test-name",
    dob: new Date().toISOString(),
    address: "unit-test-address",
    description: "unit-test-description"
  };
  request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(201)
    .end((error, res) => {
      test.error(error);
      test.match(res.body, user);
      test.end();
    });
});

tap.test("create user sparse success case", test => {
  const user = {
    id: uuid(),
    name: "unit-test-name"
  };
  request(uri)
    .post("/api/v1/users")
    .send(user)
    .expect(201)
    .end((error, res) => {
      test.error(error);
      test.match(res.body, user);
      test.end();
    });
});

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
  return {
    id: uuid(),
    name: "unit-test-name",
    address: "unit-test-address",
    description: "unit-test-description",
    dob: new Date().toISOString()
  };
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

// address too  long
user = validUser();
user.address = "A".repeat(501);
invalids.push(user);

// description too  long
user = validUser();
user.description = "A".repeat(5001);
invalids.push(user);

// dob invalid
user = validUser();
user.dob = "NOPE";
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
