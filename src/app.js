'use strict'

const boom = require('boom')
const express = require('express')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const athleteRouter = require('./routes/athlete-routes')

const app = express()

const mongoDB = 'mongodb://localhost:27017/golfAthlete'
mongoose.connect(mongoDB, { useNewUrlParser: true })
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
app.use('*', (req, res, next) => { next(boom.badRequest()) })

// handle MongoDB ObjectId CastError and boomify non-Boom errors
app.use((err, req, res, next) => {
  if (!boom.isBoom(err)) {
    if (err instanceof mongoose.Error.CastError) {
      next(boom.notFound('Not found'))
    } else {
      console.log(err.message)
      next(boom.boomify(err))
    }
  } else {
    next(err)
  }
})

// error handler expecting a Boom error
app.use((err, req, res, next) => {
  console.log(JSON.stringify(err, null, 2))
  res.status(err.output.statusCode).json(err.output.payload)
})

module.exports = app
