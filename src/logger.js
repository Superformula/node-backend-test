'use strict'

const { createLogger, format, transports } = require('winston')
const { combine, colorize, json, simple } = format

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'] // most to least importance

const logger = createLogger({
  transports: [
    new transports.Console({
      format: combine(colorize(), simple()),
      level: levels[4],
      handleExceptions: true
    }),
    new transports.File({
      format: json(),
      level: levels[2],
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exitOnError: false
})

module.exports = logger
module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}
