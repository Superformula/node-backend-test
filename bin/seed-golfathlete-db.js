#! /usr/bin/env node

'use strict'

const async = require('async')
const mongoose = require('mongoose')
const Athlete = require('../src/models/athlete')
const athleteData = require('./athlete-data')

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/golfAthleteTest', { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

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
      console.log('New Athlete: ' + newAthlete)
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

async.series([
  createAthletes
  // add create methods for SuperSpeed and TPI data
],
function (err, results) {
  if (err) {
    console.log('FINAL ERR: ' + err)
  } else {
    console.log('ATHLETES: ' + athletes)
  }
  mongoose.connection.close()
})
