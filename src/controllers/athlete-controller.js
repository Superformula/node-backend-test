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
    } else if (results.athlete == null) {
      return next(boom.notFound())
    }
    res.status(200).json(util.fromMongoDb(results.athlete))
  })
}

exports.createAthlete = (req, res, next) => {
  // todo index ghinNumber to avoid collection scan
  Athlete.findOne({ ghinNumber: req.body.ghinNumber })
    .exec((err, athlete) => {
      if (err) {
        return next(err)
      } else if (athlete && athlete.ghinNumber && athlete.ghinNumber === req.body.ghinNumber) {
        return next(boom.badRequest('Athlete with this GHIN number already exists'))
      }
      const now = Date.now()
      const newAthlete = new Athlete(Object.assign({ _id: uuid(), createdAt: now, updatedAt: now }, req.body))
      newAthlete.save((err, result) => {
        if (err) {
          return next(err)
        } else {
          res.status(201).json(util.fromMongoDb(result))
        }
      })
    })
}

exports.updateAthlete = (req, res, next) => {
  Athlete.findById(req.params.id)
    .exec((err, athlete) => {
      if (err) {
        return next(err)
      } else if (athlete == null) {
        return next(boom.notFound())
      }
      // do not allow the createdAt value to updated and set a the current date/time on the updatedAt
      let updatedAthlete = new Athlete(Object.assign(util.toMongoDb(req.body), { _id: req.params.id, createdAt: athlete.createdAt, updatedAt: Date.now() }))
      updatedAthlete.isNew = false
      updatedAthlete.save((err, result) => {
        if (err) {
          return next(err)
        } else {
          res.status(204).send()
        }
      })
    })
}

// implement using jsonpath; will be useful once the object graph becomes more complex
exports.patchAthlete = (req, res, next) => {
  res.send('NOT IMPLEMENTED')
}

exports.deleteAthlete = (req, res, next) => {
  Athlete.findById(req.params.id)
    .exec((err, athlete) => {
      if (err) {
        return next(err)
      } else if (athlete == null) {
        return next(boom.notFound())
      }
      Athlete.deleteOne({ _id: req.params.id })
        .then(res.status(204).send())
        .catch(err => { return next(err) })
    })
}
