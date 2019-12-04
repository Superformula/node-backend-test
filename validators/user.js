import validate from 'validate.js';

export const userValidationCriteria = {
  name: {
    presence: true
  },
  dob: {
    presence: true,
    format: {
      pattern: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
      message: function(value, attribute, validatorOptions, attributes, globalOptions) {
        return validate.format("^%{s} is not a valid date of birth, expected yyyy-mm-dd", {
          s : value
        });
      }
    }
  },
  "address.streetAddress" : {
    presence: true
  },
  "address.streetAddress2" : {
    presence : false
  },
  "address.city" : {
    presence : true,
    type : "string"
  },
  "address.state" : {
    presence : true,
    type : "string"
  },
  "address.postal" : {
    presence : true,
    type : "string"
  },
  "address.country" : {
    presence : true,
    type : "string"
  },
  description: {
    presence: true,
    type:"string"
  }
};

export const UUID_V1 = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
