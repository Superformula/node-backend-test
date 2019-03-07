'use strict'

const boom = require('boom')
const util = require('../util')
const Athlete = require('../models/athlete')

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
    // todo index ghinNumber to avoid collection scan
    const result = await Athlete.findOne({ ghinNumber: req.body.ghinNumber })
    if (result && result.ghinNumber && result.ghinNumber === req.body.ghinNumber) {
      return next(boom.badRequest('Athlete with this GHIN number already exists'))
    }
    const now = Date.now()
    const athlete = new Athlete({ ...req.body, createdAt: now, updatedAt: now })
    const newAthlete = await athlete.save()
    res.status(201).json(util.fromMongoDb(newAthlete))
  } catch (err) {
    return next(err)
  }
}

exports.updateAthlete = async (req, res, next) => {
  try {
    const result = await Athlete.findById(req.params.id)
    if (result == null) {
      return next(boom.notFound())
    }
    // do not allow createdAt to be modified
    delete req.body.createdAt
    const athlete = new Athlete({ ...util.toMongoDb(req.body), _id: req.params.id })
    athlete.isNew = false
    await athlete.save()
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
    const result = await Athlete.findByIdAndDelete(req.params.id)
    if (result == null) {
      return next(boom.notFound())
    }
    res.status(204).send()
  } catch (err) {
    return next(err)
  }
}
