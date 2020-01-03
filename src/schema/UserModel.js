const idProperty = {
    description: 'Unique ID for the user',
    type: 'string',
    minLength: 36,
    maxLength: 36,
};

const nameProperty = {
    description: 'First and Last Name',
    type: 'string',
    minLength: 1,
    maxLength: 100,
};

const dobProperty = {
    description: 'Date of birth YYYY-MM-DD',
    type: 'string',
    minLength: 10,
    maxLength: 10,
};

const descriptionProperty = {
    description: 'Description of the user',
    type: 'string',
    maxLength: 500,
};

const streetProperty = {
    description: 'Street Address',
    type: 'string',
    minLength: 1,
    maxLength: 100,
};

const cityProperty = {
    description: 'City',
    type: 'string',
    minLength: 1,
    maxLength: 100,
};

const stateProperty = {
    description: 'State',
    type: 'string',
    minLength: 2,
    maxLength: 2,
};

const zipProperty = {
    description: 'Zip Code',
    type: 'string',
    minLength: 5,
    maxLength: 10,
};

const Create = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['name', 'dob', 'address'],
    properties: {
        name: nameProperty,
        dob: dobProperty,
        description: descriptionProperty,
        address: {
            type: 'object',
            required: ['street', 'city', 'state', 'zip'],
            properties: {
                street: streetProperty,
                city: cityProperty,
                state: stateProperty,
                zip: zipProperty,
            },
        },
    },
    additionalProperties: false,
};

const Update = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
        id: idProperty,
        name: nameProperty,
        dob: dobProperty,
        description: descriptionProperty,
        address: {
            type: 'object',
            properties: {
                street: streetProperty,
                city: cityProperty,
                state: stateProperty,
                zip: zipProperty,
            },
        },
    },
    additionalProperties: false,
};

module.exports = { Create, Update };
