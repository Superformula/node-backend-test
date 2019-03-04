const chai = require('chai')
const expect = chai.expect
const util = require('../src/util')

describe('util', () => {
  describe('toMongoDB', () => {
    it('should replace id with _id', () => {
      const doc = util.toMongoDb({ id: 'foo' })
      expect(doc._id).to.equal('foo')
    })
  }),
  describe('fromMongoDB', () => {
    it('should replace _id with id', () => {
      const doc = util.fromMongoDb({ _id: 'foo' })
      expect(doc.id).to.equal('foo')
    })
  })
})
