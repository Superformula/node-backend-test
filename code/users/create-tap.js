const request = require("supertest");
const tap = require("tap");
const uuid = require("uuid/v4");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("create user", test => {
  const user = {
    id: uuid(),
    name: "Test User Name"
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
