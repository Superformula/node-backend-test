#! /usr/bin/env node

'use strict'

const async = require('async')
const Athlete = require('../src/models/athlete')

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/golfAthleteTest', { useNewUrlParser: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const athletes = []

function createAthlete (lastName, firstName, ghinNumber, cachedGhinIndex, cachedGhinIndexDate, driverClubHeadSpeed, dob, address, description, cb) {
  const now = Date.now()

  const athlete = new Athlete({
    lastName: lastName,
    firstName: firstName,
    ghinNumber: ghinNumber,
    cachedGhinIndex: cachedGhinIndex,
    cachedGhinIndexDate: cachedGhinIndexDate,
    driverClubHeadSpeed: driverClubHeadSpeed,
    dob: dob,
    address: address,
    description: description,
    createdAt: now,
    updatedAt: now
  })

  athlete.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Athlete: ' + athlete)
    athletes.push(athlete)
    cb(null, athlete)
  })
}

function createAthletes (cb) {
  async.series([
    function (callback) {
      createAthlete('Udom', 'Charlie', '5192665', '8.3', '2019-03-02', '106.4', '1973-01-01', '4235 NW 192nd Ave, Portland, OR 97229', 'TPI Level 2 Certified Coach', callback)
    },
    function (callback) {
      createAthlete('Udom', 'Alexa', '0146376', '+2.0', '2019-03-02', '97.1', '2002-01-01', '4235 NW 192nd Ave, Portland, OR 97229', 'Future NCAA D1 Golfer', callback)
    },
    function (callback) {
      createAthlete('Udom', 'Momo', '1239208', '6.9', '2019-03-02', '85.3', '2004-01-01', '4235 NW 192nd Ave, Portland, OR 97229', 'Freshman on the Varsity Golf Team', callback)
    }
  ],
  cb)
}

async.series([
  createAthletes
],
function (err, results) {
  if (err) {
    console.log('FINAL ERR: ' + err)
  } else {
    console.log('ATHLETES: ' + athletes)
  }
  mongoose.connection.close()
})
