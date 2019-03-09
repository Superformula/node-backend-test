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
  cachedGhinIndex: joi.string().min(1).max(5),
  cachedGhinIndexDate: joi.date().iso(),
  driverClubHeadSpeed: joi.number().precision(1),
  dob: joi.date().iso(),
  address: joi.string().min(1).max(200),
  description: joi.string().min(1).max(300)
})

const convertedSchema = joigoose.convert(joiAthleteSchema)

// Commented this out because this prevents using save for updateAthlete.
// Using save for updateAthlete takes advantage of the joi validate that was added.
// Moving this check to createAthlete.
// check for existing athlete by GHIN number
// convertedSchema.ghinNumber.unique = true

const AthleteSchema = new Schema(convertedSchema, { timestamps: true })

AthleteSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true
  next()
})

AthleteSchema
  .virtual('fullName')
  .get(function () {
    return this.lastName + ', ' + this.firstName
  })

module.exports = mongoose.model('Athlete', AthleteSchema)
