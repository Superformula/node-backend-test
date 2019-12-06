import uuid from "uuid";

export default class User {
  async create(user) {
    if (user.name === "EXCEPTION") {
      throw "Internal Server Error";
    }
    return Promise.resolve(user);
  }

  async read(id) {
    if (id === "f18f46e0-16d7-11ea-8260-1541765a4531") {
      return Promise.resolve({
        name : "Graham Evans"
      })
    } else if (id === "b9c9e570-1791-11ea-8d71-362b9e155667") {
      throw "Internal Server Error";
    }
    return Promise.resolve();
  }

  async update(id, user) {
    if (user.name === "EXCEPTION") {
      throw "Internal Server Error";
    }
    return Promise.resolve({
      id: uuid.v1(),
      name:user.name,
      dob: user.dob,
      address: user.address,
      description: user.description,
      updatedAt: Date.now(),
      createdAt: Date.now()
    });
  }

  async delete(id) {
    if (id === "b9c9e570-1791-11ea-8d71-362b9e155667") {
      throw "Internal Server Error";
    }
    return Promise.resolve({});
  }

  async filter(name) {
    if (name !== "Graham Evans") {
      throw "Internal Server Error";
    }
    return Promise.resolve([
      {
        city: 'Airdrie',
        streetAddress: '2016 Morris Rd',
        streetAddress2: null,
        dob: '1987-03-18',
        createdAt: 1575655942754,
        postal: 'T4A 1V9',
        description: 'This is a test user',
        id: 'f310d420-1853-11ea-a0f6-7fbfe364484b',
        name: 'Graham Evans',
        country: 'Canada',
        state: 'AB'
      },
      {
        city: 'Airdrie',
        streetAddress: '2016 Morris Rd',
        streetAddress2: null,
        dob: '1987-03-18',
        createdAt: 1575594167521,
        postal: 'T4A 1V9',
        description: 'This is a test user',
        id: '1e282e00-17c4-11ea-955e-fb8c365df04d',
        name: 'Graham Evans',
        country: 'Canada',
        state: 'AB'
      }
    ]);
  }
}
