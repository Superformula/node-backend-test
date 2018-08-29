require('babel-register');
require('babel-polyfill');

const fs = require('fs');
const path = require('path');
const env = require('dotenv');

if (!fs.readFileSync(path.resolve(__dirname, '../.env'))) {
  console.log('.env configuration file must exist inside of the rest-server root');
  process.exit();
}

const myEnv = env.config({
  path: path.resolve(__dirname, '../.env'),
});

if (myEnv && myEnv.parsed) {
  let flag = false;
  flag = myEnv.parsed.hasOwnProperty('DEBUG') ? flag : true;
  flag = myEnv.parsed.hasOwnProperty('NODE_ENV') ? flag : true;
  flag = myEnv.parsed.hasOwnProperty('PORT') ? flag : true;
  flag = myEnv.parsed.hasOwnProperty('LOCAL_DATABASE') ? flag : true;
  flag = myEnv.parsed.hasOwnProperty('AWS_DATABASE') ? flag : true;
  flag = myEnv.parsed.hasOwnProperty('mapboxAPIKey') ? flag : true;
  flag = myEnv.parsed.hasOwnProperty('DOCKER') ? flag : true;
  flag && (console.log('.env configuration file is not complete'), process.exit());
}

require('../src');
