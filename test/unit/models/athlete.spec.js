const chai = require('chai')
const expect = chai.expect
const Athlete = require('../../../src/models/athlete')

describe('new Athlete', () => {
  it('should create a new instance of Athlete', () => {
    const now = Date.now()
    const athlete = new Athlete({
      lastName: 'Heath',
      firstName: 'Jenny',
      ghinNumber: '8675309',
      cachedGhinIndex: '+3.0',
      cachedGhinIndexDate: '2019-03-02',
      driverClubHeadSpeed: 106.4,
      dob: '1981-01-01',
      address: '123 Abc St, Beverly Hills, CA 90210',
      description: 'Elite amateur',
      createdAt: now,
      updatedAt: now
    })
    expect(athlete._id).to.not.equal(null)
    expect(athlete.fullName).to.equal('Heath, Jenny')
    // todo add more tests
  })
})
