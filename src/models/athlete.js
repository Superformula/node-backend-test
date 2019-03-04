'use strict'

const mongoose = require('mongoose')
const joigoose = require('joigoose')(mongoose)
const joi = require('joi')
const uuid = require('uuid/v1')

const Schema = mongoose.Schema

const joiAthleteSchema = joi.object({
  _id: joi.string().guid().default(() => uuid(), 'default UUID'),
  lastName: joi.string().min(1).max(100).required(),
  firstName: joi.string().min(1).max(100).required(),
  ghinNumber: joi.string().min(7).max(7),
  cachedGhinIndex: joi.string().min(1).max(100),
  cachedGhinIndexDate: joi.date().iso(),
  driverClubHeadSpeed: joi.number().precision(1),
  dob: joi.date().iso(),
  address: joi.string().min(1).max(100),
  description: joi.string().min(1).max(100),
  createdAt: joi.date().iso(),
  updatedAt: joi.date().iso()
})

const convertedSchema = joigoose.convert(joiAthleteSchema)

// check for existing athlete by GHIN number
convertedSchema.ghinNumber.unique = true

const AthleteSchema = new Schema(convertedSchema)

AthleteSchema
  .virtual('fullName')
  .get(function () {
    return this.lastName + ', ' + this.firstName
  })

module.exports = mongoose.model('Athlete', AthleteSchema)
