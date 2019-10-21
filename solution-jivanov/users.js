
// Require needed libraries and modules
const Service = require('./services/users.js');

module.exports.create = async (event, context) => {
    let httpCode = 200; // default is success
    let message = 'Successfully created a new record in the database';
    let itemId = '';


    try {
        const { body: itemData = '{}' } = event; // extract the body as itemData, defaulting to empty object
        console.log("itemData= ", itemData);

        const service = new Service();

        itemId = await service.create(itemData);
    }
    catch (err) {
        console.log('ERROR thrown (users/create): ', err);
        httpCode = 400;
        message = 'ERROR: Create failed! Details (if available):  ' + err.message;
    }
  
    return Service.response(httpCode, {message: message, itemId: itemId});
};

module.exports.read = async (event, context) => {
    let httpCode = 200; // default is success
    let message = 'Success';
    let data = '';
    let itemId = '';


    try {
        ({ id: itemId = '' } = event.pathParameters); // extract the ID from the path
        console.log("itemId= ", itemId);

        const service = new Service();

        data = await service.read(itemId);
    }
    catch (err) {
        console.log('ERROR thrown (users/read): ', err);
        httpCode = 400;
        message = 'ERROR: Read failed! Details (if available):  ' + err.message;
    }

    return Service.response(httpCode, {message: message, itemId: itemId, data: data});
};

module.exports.update = async (event, context) => {
    let httpCode = 200; // default is success
    let message = 'Successfully updated the record in the database';
    let itemId = '';


    try {
        ({ id: itemId = '' } = event.pathParameters); // extract the ID from the path
        console.log("itemId= ", itemId);

        const { body: itemData = '{}' } = event; // extract the body as itemData, defaulting to empty object
        console.log("itemData= ", itemData);

        const service = new Service();

        await service.update(itemId, itemData);
    }
    catch (err) {
        console.log('ERROR thrown (users/update): ', err);
        httpCode = 400;
        message = 'ERROR: Update failed! Details (if available): ' + err.message;
    }

    return Service.response(httpCode, {message: message, itemId: itemId});
};

module.exports.delete = async (event, context) => {
    let httpCode = 200; // default is success
    let message = 'Successfully deleted the record from the database';
    let itemId = '';


    try {
        ({ id: itemId = '' } = event.pathParameters); // extract the ID from the path
        console.log("itemId= ", itemId);

        const service = new Service();

        await service.delete(itemId);
    }
    catch (err) {
        console.log('ERROR thrown (users/delete): ', err);
        httpCode = 400;
        message = 'ERROR: Delete failed! Details (if available): ' + err.message;
    }

    return Service.response(httpCode, {message: message, itemId: itemId});
};

module.exports.query = async (event, context) => {
    console.log("users/query context= ", context);
    console.log("users/query event= ", event);

    let httpCode = 200; // default is success
    let message = 'Success';

    const { body: input = '{}' } = event; // extract the body as input, defaulting to empty object

    console.log("input= ", input);

    try {
        const service = new Service();

        await service.query();
    }
    catch (err) {
        console.log('ERROR thrown (users/query): ', err);
        httpCode = 400;
        message = 'ERROR: ' + err.message;
    }

    return Service.response(httpCode, {'message': message});
};