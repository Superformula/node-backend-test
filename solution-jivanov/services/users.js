// users.js
// users - main service class to work with users

const Service = require('../lib/service.js');
const Model = require('../models/users.js');

class Users extends Service {
    constructor() {
        super();
        this.model = new Model();
    }

    async create(itemData) {
        this.model.validateData(itemData);
        return await this.model.create();
    }

    async read(itemId) {
        this.model.validateId(itemId);
        return await this.model.read();
    }

    async update(itemId, itemData) {
        this.model.validateId(itemId);
        this.model.validateUpdate(itemData);
        return await this.model.update();
    }

    async delete(itemId) {
        this.model.validateId(itemId);
        return await this.model.delete();
    }

    // implements a GraphQL query
    async query() {
    }
}

module.exports = Users;