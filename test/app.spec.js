'use strict'

const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose')
const app = require('../src/app')

describe('app', () => {
  let id
  let createdAt

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

  describe('POST /api/v1/athletes', () => {
    it('should create a new athlete', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(athlete)
        .set('Accept', 'application/json')
        .expect(201)
        .end((err, res) => {
          id = res.body.id
          createdAt = res.body.createdAt
          expect(res.body.lastName).to.equal('McTesterson')
          done()
        })
    })
    it('should create a new athlete with no GHIN number', done => {
      request(app)
        .post('/api/v1/athletes')
        .send({ ...athlete, ghinNumber: undefined })
        .set('Accept', 'application/json')
        .expect(201, done)
    })
    it('should create another new athlete with no GHIN number', done => {
      request(app)
        .post('/api/v1/athletes')
        .send({ ...athlete, ghinNumber: undefined })
        .set('Accept', 'application/json')
        .expect(201, done)
    })
    it('should return a 400 with same id', done => {
      request(app)
        .post('/api/v1/athletes')
        .send({ ...athlete, id })
        .set('Accept', 'application/json')
        .expect(400, done)
    })
    it('should return a 400 with same GHIN number', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(athlete)
        .set('Accept', 'application/json')
        .expect(400, done)
    })
    it('should return a 400 error with last name missing', done => {
      request(app)
        .post('/api/v1/athletes')
        .send({ ...athlete, lastName: undefined })
        .set('Accept', 'application/json')
        .expect(400, done)
    })
    it('should return a 400 error with GHIN number too short', done => {
      request(app)
        .post('/api/v1/athletes')
        .send({ ...athlete, ghinNumber: '123456' })
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('GET /api/v1/athletes', () => {
    it('should return a list of all athletes', done => {
      request(app)
        .get('/api/v1/athletes')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array')
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
          expect(res.body.id).to.equal(id)
          expect(res.body.lastName).to.equal('McTesterson')
          done()
        })
    })
    it('should return a 404 error with invalid id', done => {
      request(app)
        .get(`/api/v1/athletes/foo`)
        .expect('Content-Type', /json/)
        .expect(404, done)
    })
  })

  describe('PUT /api/v1/athletes/:id', () => {
    it('should update existing athlete by id', done => {
      request(app)
        .put(`/api/v1/athletes/${id}`)
        .send({ ...athlete, id, lastName: undefined, firstName: 'Tester', createdAt: '1999-12-31' })
        .set('Accept', 'application/json')
        .expect(204, done)
    })
  })

  describe('GET /api/v1/athletes/:id', () => {
    it('should return one updated athlete by id', done => {
      request(app)
        .get(`/api/v1/athletes/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.id).to.equal(id)
          expect(res.body.lastName).to.equal(athlete.lastName)
          expect(res.body.firstName).to.equal('Tester')
          expect(res.body.createdAt).to.equal(createdAt)
          done()
        })
    })
  })

  describe('PUT /api/v1/athletes/:id', () => {
    it('should return a 400 error with invalid id', done => {
      const invalidId = 'foo'
      request(app)
        .put(`/api/v1/athletes/${invalidId}`)
        .send({ ...athlete, id: invalidId })
        .expect('Content-Type', /json/)
        .expect(400, done)
    })
    it('should return 400 with path id and body id not matching', done => {
      request(app)
        .put(`/api/v1/athletes/${id}`)
        .send({ ...athlete, id: 'foo' })
        .set('Accept', 'application/json')
        .expect(400, done)
    })
    it('should return 404 with path id and body id not found', done => {
      const notFoundId = '2c3b3580-429c-11e9-b3fc-53aac329b547'
      request(app)
        .put(`/api/v1/athletes/${notFoundId}`)
        .send({ ...athlete, id: notFoundId })
        .set('Accept', 'application/json')
        .expect(404, done)
    })
    it('should return 400 with GHIN number too long', done => {
      request(app)
        .put(`/api/v1/athletes/${id}`)
        .send({ ...athlete, id, ghinNumber: '12345678' })
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('DELETE /api/v1/athletes/:id', () => {
    it('should delete existing athlete by id', done => {
      request(app)
        .delete(`/api/v1/athletes/${id}`)
        .send({ ...athlete, id })
        .set('Accept', 'application/json')
        .expect(204, done)
    })
    it('should 404 for previously deleted athlete', done => {
      request(app)
        .delete(`/api/v1/athletes/${id}`)
        .send({ ...athlete, id })
        .set('Accept', 'application/json')
        .expect(404, done)
    })
  })

  after(done => {
    // close the connection opened by SuperTest
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done)
    })
  })
})
