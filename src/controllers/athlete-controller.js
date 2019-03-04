'use strict'

const async = require('async')
const boom = require('boom')
const uuid = require('uuid/v1')
const util = require('../util')
const Athlete = require('../models/athlete')

exports.getAthletes = (req, res, next) => {
  Athlete.find()
    .sort([['lastName', 'ascending'], ['firstName', 'ascending']])
    .exec(function (err, list) {
      if (err) { return next(err) }
      res.status(200).json(list.map(doc => util.fromMongoDb(doc)))
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
    res.status(200).json(util.fromMongoDb(results.athlete))
  })
}

exports.createAthlete = (req, res, next) => {
  const now = Date.now()
  const athlete = new Athlete(Object.assign({ _id: uuid(), createdAt: now, updatedAt: now }, req.body))
  athlete.save((err, newAthlete) => {
    if (err) {
      return next(err)
    } else {
      res.status(201).json(util.fromMongoDb(newAthlete))
    }
  })
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
