'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AthleteSchema = new Schema({
  lastName: { type: String, required: true, max: 100 },
  firstName: { type: String, required: true, max: 100 },
  ghinNumber: { type: String, required: false, min: 7, max: 7 },
  cachedGhinIndex: { type: String },
  cachedGhinIndexDate: { type: Date },
  driverClubHeadSpeed: { type: mongoose.Decimal128 },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
})

AthleteSchema
  .virtual('fullName')
  .get(function () {
    return this.lastName + ', ' + this.firstName
  })

module.exports = mongoose.model('Athlete', AthleteSchema)
