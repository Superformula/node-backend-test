'use strict'

const async = require('async')
const boom = require('boom')
const Athlete = require('../models/athlete')

exports.getAthletes = (req, res, next) => {
  Athlete.find()
    .sort([['lastName', 'ascending'], ['firstName', 'ascending']])
    .exec(function (err, list) {
      if (err) { return next(err) }
      res.status(200).json(list)
    })
}

exports.getAthlete = (req, res, next) => {
  // todo get GHIN index from ghin.com
  async.parallel({
    athlete: (callback) => {
      Athlete.findById(req.params.id)
        .exec(callback)
    }
  }, function (err, results) {
    if (err) {
      return next(err)
    }
    if (results.athlete == null) {
      return next(boom.notFound())
    }
    res.status(200).json(results.athlete)
  })
}

exports.createAthlete = (req, res, next) => {
  // todo joi validation and existing user check based on GHIN number
  const validationResult = null
  if (validationResult && validationResult.error) {
    // todo add validation message
    return (boom.badRequest())
  } else {
    const now = Date.now()
    const athlete = new Athlete(
      {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        ghinNumber: req.body.ghinNumber,
        cachedGhinIndex: req.body.cachedGhinIndex,
        cachedGhinIndexDate: req.body.cachedGhinIndexDate,
        driverClubHeadSpeed: req.body.driverClubHeadSpeed,
        dob: req.body.dob,
        address: req.body.address,
        description: req.body.description,
        createdAt: now,
        updatedAt: now
      })
    athlete.save((err, newAthlete) => {
      if (err) {
        return next(err)
      }
      res.status(201).json(newAthlete)
    })
  }
}

exports.updateAthlete = (req, res, next) => {
  res.send('NOT IMPLEMENTED')
}

exports.patchAthlete = (req, res, next) => {
  res.send('NOT IMPLEMENTED')
}

exports.deleteAthlete = (req, res, next) => {
  res.send('NOT IMPLEMENTED')
}
