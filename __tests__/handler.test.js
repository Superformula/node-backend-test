const fetch = require("node-fetch");
const faker = require("faker");
const { DynamoDB } = require("aws-sdk");
const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const domain = `http://localhost:3000`;

test("crud", async () => {
  const createUserBody = {
    name: faker.name.findName(),
    dob: faker.date.past().toUTCString(),
    address: faker.address.streetAddress(),
    description: faker.lorem.sentence()
  };
  const createUserResponse = await fetch(`${domain}/user`, {
    method: "post",
    body: JSON.stringify(createUserBody),
    headers: { "Content-Type": "application/json" }
  });
  const createUserResponseBody = await createUserResponse.json();
  expect(createUserResponseBody).toMatchObject(createUserBody);
  expect(createUserResponseBody.createdAt).toBeLessThan(Date.now());
  expect(createUserResponseBody.updatedAt).toBeLessThan(Date.now());

  const userId = createUserResponseBody.id;
  const readUserResponse = await fetch(`${domain}/user/${userId}`);
  const readUserResponseBody = await readUserResponse.json();

  expect(readUserResponseBody).toStrictEqual(createUserResponseBody);

  const updateUserBody = {
    name: faker.name.findName(),
    dob: faker.date.past().toUTCString(),
    address: faker.address.streetAddress(),
    description: faker.lorem.sentence()
  };
  const updateUserResponse = await fetch(`${domain}/user/${userId}`, {
    method: "patch",
    body: JSON.stringify(updateUserBody),
    headers: { "Content-Type": "application/json" }
  });
  const updateUserResponseBody = await updateUserResponse.json();
  expect(updateUserResponseBody).toMatchObject(updateUserBody);
  expect(updateUserResponseBody.updatedAt).toBeGreaterThan(
    updateUserResponseBody.createdAt
  );

  const deleteUserResponse = await fetch(`${domain}/user/${userId}`, {
    method: "delete",
    headers: { "Content-Type": "application/json" }
  });
  const deleteUserResponseBody = await deleteUserResponse.json();
  expect(deleteUserResponseBody).toStrictEqual(updateUserResponseBody);

  const readDeletedUserResponse = await fetch(`${domain}/user/${userId}`);
  const readDeletedUserResponseBody = await readDeletedUserResponse.json();

  expect(readDeletedUserResponseBody.error).toBe("User Not Found");
});
