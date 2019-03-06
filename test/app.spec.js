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
  })

  describe('POST /api/v1/athletes', () => {
    it('should create a new athlete with no GHIN number', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { ghinNumber: undefined }))
        .set('Accept', 'application/json')
        .expect(201, done)
    })
  })

  describe('POST /api/v1/athletes', () => {
    it('should create another new athlete with no GHIN number', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { ghinNumber: undefined }))
        .set('Accept', 'application/json')
        .expect(201, done)
    })
  })

  describe('POST /api/v1/athletes with same id', () => {
    it('should return a 400', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { id: id }))
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('POST /api/v1/athletes with same GHIN number', () => {
    it('should return a 400', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(athlete)
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('POST /api/v1/athletes with last name is missing', () => {
    it('should return a 400 error', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { lastName: undefined }))
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('POST /api/v1/athletes with GHIN number too short', () => {
    it('should return a 400 error', done => {
      request(app)
        .post('/api/v1/athletes')
        .send(Object.assign({}, athlete, { ghinNumber: '123456' }))
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
  })

  describe('GET /api/v1/athletes/:id with invalid id', () => {
    it('should return a 404 error', done => {
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
        .send(Object.assign({}, athlete, { id: id, firstName: 'Tester', createdAt: '1999-12-31' }))
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
          expect(res.body.firstName).to.equal('Tester')
          done()
        })
    })
  })

  describe('PUT /api/v1/athletes/:id with invalid id', () => {
    it('should return a 404 error', done => {
      request(app)
        .put(`/api/v1/athletes/foo`)
        .expect('Content-Type', /json/)
        .expect(404, done)
    })
  })

  describe('PUT /api/v1/athletes/:id with last name missing', () => {
    it('should return 400', done => {
      request(app)
        .put(`/api/v1/athletes/${id}`)
        .send(Object.assign({}, athlete, { id: id, lastName: undefined }))
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('PUT /api/v1/athletes/:id with GHIN number too long', () => {
    it('should return 400', done => {
      request(app)
        .put(`/api/v1/athletes/${id}`)
        .send(Object.assign({}, athlete, { id: id, ghinNumber: '12345678' }))
        .set('Accept', 'application/json')
        .expect(400, done)
    })
  })

  describe('DELETE /api/v1/athletes/:id', () => {
    it('should delete existing athlete by id', done => {
      request(app)
        .delete(`/api/v1/athletes/${id}`)
        .send(Object.assign({}, athlete, { id: id }))
        .set('Accept', 'application/json')
        .expect(204, done)
    })
  })

  describe('DELETE /api/v1/athletes/:id', () => {
    it('should 404 for previously deleted athlete', done => {
      request(app)
        .delete(`/api/v1/athletes/${id}`)
        .send(Object.assign({}, athlete, { id: id }))
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
