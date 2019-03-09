'use strict'

const boom = require('boom')
const util = require('../util')
const Athlete = require('../models/athlete')
const _ = require('lodash')

exports.getAthletes = async (req, res, next) => {
  try {
    const list = await Athlete.find()
      .sort([['lastName', 'ascending'], ['firstName', 'ascending']])
    res.status(200).json(list.map(doc => util.fromMongoDb(doc)))
  } catch (err) {
    return next(err)
  }
}

exports.getAthlete = async (req, res, next) => {
  try {
    // todo get GHIN index from ghin.com
    const [athlete] = await Promise.all([Athlete.findById(req.params.id)])
    if (athlete == null) {
      return next(boom.notFound())
    }
    res.status(200).json(util.fromMongoDb(athlete))
  } catch (err) {
    return next(err)
  }
}
exports.createAthlete = async (req, res, next) => {
  try {
    if (req.body.ghinNumber) {
      // todo index ghinNumber to avoid collection scan
      const result = await Athlete.findOne({ ghinNumber: req.body.ghinNumber })
      if (_.hasIn(result, 'ghinNumber') && _.get(result._doc, 'ghinNumber') === req.body.ghinNumber) {
        return next(boom.badRequest('Athlete with this GHIN number already exists'))
      }
    }
    const athlete = new Athlete(util.toMongoDb(req.body))
    const newAthlete = await athlete.save()
    res.status(201).json(util.fromMongoDb(newAthlete))
  } catch (err) {
    return next(err)
  }
}

exports.updateAthlete = async (req, res, next) => {
  try {
    if (req.params.id !== req.body.id) {
      return next(boom.badRequest('Path id and body id do not match'))
    }
    const result = await Athlete.findOneAndUpdate({ _id: req.params.id }, { ...util.toMongoDb(req.body) })
    if (result == null) {
      return next(boom.notFound())
    }
    res.status(204).send()
  } catch (err) {
    return next(err)
  }
}

// implement using jsonpath; will be useful once the object graph becomes more complex
exports.patchAthlete = (req, res, next) => {
  res.send('NOT IMPLEMENTED')
}

exports.deleteAthlete = async (req, res, next) => {
  try {
    const result = await Athlete.findOneAndDelete({ _id: req.params.id })
    if (result == null) {
      return next(boom.notFound())
    }
    res.status(204).send()
  } catch (err) {
    return next(err)
  }
}
