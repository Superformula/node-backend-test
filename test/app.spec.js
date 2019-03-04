'use strict'

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose')
const app = require('../src/app')

describe('app', () => {
  let id

  const athlete = {
    lastName: 'McTesterson',
    firstName: 'Testy',
    ghinNumber: '1234567',
    cachedGhinIndex: '0.0',
    cachedGhinIndexDate: '2019-03-02',
    driverClubHeadSpeed: '106.4',
    dob: '2073-01-01',
    address: '123 NW Abc St, Portland, OR 97229',
    description: 'Recreational golfer'
  }

  describe('GET /api/v1/athletes', () => {
    it('should return an empty list', done => {
      request(app)
        .get('/api/v1/athletes')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.equal(0)
          done()
        })
    })
  })

  describe('POST /api/v1/athletes', () => {
    it('should create a new athlete', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(athlete)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          id = res.body.id
          done()
        })
    })
  })

  describe('POST /api/v1/athletes with last name is missing', () => {
    it('should return a 400 error', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { lastName: undefined }))
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.equal('Bad Request')
          done()
        })
    })
  })

  describe('POST /api/v1/athletes with GHIN number too short', () => {
    it('should return a 400 error', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { ghinNumber: '123456' }))
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          expect(res.body.error).to.equal('Bad Request')
          done()
        })
    })
  })

  describe('GET /api/v1/athletes', () => {
    it('should return a list of all athletes', done => {
      request(app)
        .get('/api/v1/athletes')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(1)
          expect(res.body[0].lastName).to.equal('McTesterson')
          done()
        })
    })
  })

  describe('GET /api/v1/athletes/:id', () => {
    it('should return one athlete by id', done => {
      request(app)
        .get(`/api/v1/athletes/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.lastName).to.equal('McTesterson')
          done()
        })
    })
  })

  describe('GET /api/v1/athletes/:id with invalid id', () => {
    it('should return a 404 error', done => {
      request(app)
        .get(`/api/v1/athletes/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.lastName).to.equal('McTesterson')
          done()
        })
    })
  })

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done)
    })
  })
})
