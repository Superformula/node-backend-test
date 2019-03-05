'use strict'

const router = require('express').Router()
const athleteController = require('../controllers/athlete-controller')

router.route('/:id')
  .get(athleteController.getAthlete)
  .put(athleteController.updateAthlete)
  .patch(athleteController.patchAthlete)
  .delete(athleteController.deleteAthlete)

router.route('/')
  .get(athleteController.getAthletes)
  .post(athleteController.createAthlete)

module.exports = router
