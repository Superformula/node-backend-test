'use strict'

const boom = require('boom')
const express = require('express')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger')
const _ = require('lodash')

const config = require('./config')
const logger = require('./logger')
const athleteRouter = require('./routes/athlete-routes')

const app = express()

mongoose.set('useCreateIndex', true)
mongoose.set('runValidators', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(`${config.db.url}${config.db.name}`, { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', logger.error.bind(console, 'MongoDB connection error:'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 180 // limit each IP to 100 requests per windowMs
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(limiter) // apply to all requests; todo configure per route as appropriate
app.use(morgan(config.log.morganFormat, { 'stream': logger.stream }))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/athletes', athleteRouter)
app.use('*', (req, res, next) => { next(boom.badRequest('Invalid route')) })

app.use((err, req, res, next) => {
  if (!boom.isBoom(err)) {
    if (isBadRequest(err)) {
      logger.debug(err)
      next(boom.badRequest(err.message))
    } else {
      logger.error(err)
      next(boom.boomify(err)) // boomify all other non-Boom errors
    }
  } else {
    logger.debug(err)
    next(err)
  }
})

// error handler expecting a Boom error
app.use((err, req, res, next) => {
  res.status(err.output.statusCode).json(err.output.payload)
})

function isBadRequest (err) {
  const name = _.get(err, 'name')
  // handle joi validation errors and MongoDB duplicate key errors
  if (name === 'ValidationError' || (name === 'MongoError' && _.get(err, 'code') === 11000)) {
    return true
  }
}

module.exports = app
