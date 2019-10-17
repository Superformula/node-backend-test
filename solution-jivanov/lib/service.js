// service.js
// Service class - base service class

const Base = require('./base.js');

// response is in service

class Service extends Base{
    constructor(options = {}) {
        super();
    }

    // returns AWS formatted response
    static response(code, payload) {
        return {
              statusCode: code,
              headers: {
                'Access-Control-Allow-Origin' : '*' // needed to handle CORS
              },
              body: JSON.stringify({
                  ...payload,
                  timestamp: new Date().toISOString()
              })
        }
    }
};

module.exports = Service;
