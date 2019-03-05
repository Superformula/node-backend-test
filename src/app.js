'use strict'

const boom = require('boom')
const express = require('express')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const athleteRouter = require('./routes/athlete-routes')

const app = express()

mongoose.set('useCreateIndex', true)
mongoose.set('runValidators', true)
mongoose.connect('mongodb://localhost:27017/golfAthleteTest', { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 180 // limit each IP to 100 requests per windowMs
})

app.use(limiter) // apply to all requests; todo configure per route as appropriate
app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/athletes', athleteRouter)
app.use('*', (req, res, next) => { next(boom.badRequest('Invalid route')) })

app.use((err, req, res, next) => {
  if (!boom.isBoom(err)) {
    if (err.name && err.name === 'ValidationError') { // handle joi validation errors
      next(boom.badRequest(err.message))
    } else if (err.name && err.name === 'MongoError' && err.code && err.code === 11000) { // handle duplicate key error
      next(boom.badRequest(err.message))
    } else {
      next(boom.boomify(err)) // boomify all other non-Boom errors
    }
  } else {
    next(err)
  }
})

// error handler expecting a Boom error
app.use((err, req, res, next) => {
  res.status(err.output.statusCode).json(err.output.payload)
})

module.exports = app
