
const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const app = require('../src/app')
const pretty = require('../src/util').pretty

describe('GET /api/v1/athletes', () => {
  it('should return a list of all athletes', done => {
    request(app)
      .get('/api/v1/athletes')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        console.log(pretty(res.body))
        expect(res.body).to.be.an('array')
        done()
      })
  })
})
