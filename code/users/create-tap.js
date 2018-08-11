const request = require("supertest");
const tap = require("tap");

let uri;

tap.beforeEach(async () => {
  uri = await require("../get-test-uri")(require("../server"));
});

tap.test("create user", test => {
  const user = {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Pat Patterson"
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

const invalids = [
  {},
  { id: "00000000-0000-0000-0000-00000000", name: "Pat Patterson" },
  { id: "00000000-0000-0000-0000-00000000", nameNope: "Pat Patterson" },
  { id: "nope", name: "Pat Patterson" },
  { idNope: "00000000-0000-0000-0000-00000000", name: "Pat Patterson" }
];
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
