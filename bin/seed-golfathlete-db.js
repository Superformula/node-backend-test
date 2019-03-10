#! /usr/bin/env node

'use strict'

const async = require('async')
const mongoose = require('mongoose')
const config = require('../src/config')
const Athlete = require('../src/models/athlete')
const athleteData = require('./athlete-data')
const logger = require('../src/logger')

mongoose.set('useCreateIndex', true)
mongoose.connect(`${config.db.url}${config.db.name}`, { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', logger.error.bind(logger, 'MongoDB connection error:'))

const athletes = []

function createAthlete (athleteData, cb) {
  const now = Date.now()

  const athlete = new Athlete({
    ...athleteData,
    createdAt: now,
    updatedAt: now
  })
  athlete.save()
    .then(newAthlete => {
      logger.info('New Athlete: ' + newAthlete)
      athletes.push(newAthlete)
      cb(null, newAthlete)
    })
    .catch(err => {
      cb(err, null)
    })
}

function createAthletes (cb) {
  async.series([
      function (callback) {
        createAthlete(athleteData.charlie, callback)
      },
      function (callback) {
        createAthlete(athleteData.alexa, callback)
      },
      function (callback) {
        createAthlete(athleteData.momo, callback)
      }
    ],
    cb)
}

db.dropDatabase().then(() => {
  async.series([
      createAthletes
      // add create methods for SuperSpeed and TPI data
    ],
    function (err, results) {
      if (err) {
        logger.error('FINAL ERR: ' + err)
      } else {
        logger.info('ATHLETES: ' + athletes)
      }
      mongoose.connection.close()
    })
})