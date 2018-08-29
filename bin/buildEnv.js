const fs = require('fs');
const { each } = require('lodash');

const envVariables = require('../.env.sample');

const createENVFile = (directory, variables) => {
  each(variables, variable => {
    fs.appendFileSync(`./${directory}/.env`, variable + '\n');
  });
}

const buildEnv = () => {
  each(envVariables, (value, key) => {
    fs.writeFileSync(`./${key}/.env`, '')
    createENVFile(key, value);
  });
}

buildEnv();