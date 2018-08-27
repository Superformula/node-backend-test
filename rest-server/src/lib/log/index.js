import * as chalk from 'chalk';

export const success = (...log) => {
  if (process.env.DEBUG === 'TRUE') console.log(chalk.default.white.bgGreen.bold(...log));
};

export const error = (...log) => {
  if (process.env.DEBUG === 'TRUE') console.error(chalk.default.white.bgRed.bold(...log));
};