const event = {
  body: '',
  pathParameters: {},
  awsRequestId: 'id',
  invokeid: 'id',
  logGroupName: '/aws/lambda/node-backend-test-dev-create',
  logStreamName: '2015/09/22/[HEAD]13370a84ca4ed8b77c427af260',
  functionVersion: 'HEAD',
  isDefaultFunctionVersion: true,
  functionName: 'node-backend-test-dev-create',
  memoryLimitInMB: '1024',
  succeed: () => {},
  fail: () => {},
  done: () => {},
  getRemainingTimeInMillis: () => { return Date.now() }
};

const context = {
    "statusCode": 201,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{}"
};

export const generateRequest = (type) => {
  switch (type) {
    case 'create':
      event.body = '{"name":"Graham Evans","dob": "1987-03-18","address": {"streetAddress": "2016 Morris Rd","streetAddress2": "","city": "Airdrie","state": "AB","postal": "T4A 1V9","country": "Canada"},"description": "This is a test user"}';
      return {event : event, context : context};
      break;
    case 'read':
      event.pathParameters = {
        id: 'f18f46e0-16d7-11ea-8260-1541765a4531'
      };
      return {event : event, context : context};
      break;
    case 'update':
      event.body = '{"name":"Graham Evans","dob": "1987-03-18","address": {"streetAddress": "2016 Morris Rd","streetAddress2": "","city": "Airdrie","state": "AB","postal": "T4A 1V9","country": "Canada"},"description": "This is a test user"}';
      event.pathParameters = {
        id: 'f18f46e0-16d7-11ea-8260-1541765a4531'
      };
      return {event : event, context : context};
      break;
    case 'delete':
      event.pathParameters = {
        id: 'f18f46e0-16d7-11ea-8260-1541765a4531'
      };
      return {event : event, context : context};
      break;
    case 'filter':
      event.pathParameters = {
        name: 'Graham Evans'
      };
      return {event : event, context : context};
      break;
    default:
      break;
  }
}

export const generateUser = () => {
  return {
    name :"Graham Evans",
    dob : "1987-03-18",
    address : {
      streetAddress : "2016 Morris Rd",
      streetAddress2 : "",
      city : "Airdrie",
      state : "AB",
      postal : "T4A 1V9",
      country : "Canada"
    },
    description : "This is a test user"
  }
}
