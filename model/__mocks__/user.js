import uuid from "uuid";

export default class User {
  async create(user) {
    if (user.name === "EXCEPTION") {
      throw "Internal Server Error";
    }
    return Promise.resolve();
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
}
