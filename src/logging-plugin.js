const good = require('good')

module.exports = {
  plugin: good,
  options: {
    ops: {
      interval: 500,
    },
    reporters: {
      consoleReporter: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
            args: [{ request: '*', error: '*', info: '*', log: '*', response: '*' }]
        }, 
        {
          module: 'good-console'
        }, 
        'stdout'
      ]
    }
  }
}