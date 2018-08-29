require('babel-register');
require('babel-polyfill');

const { User } = require('../src/config/database/collections/userCollections');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/');
const should = chai.should();

chai.use(chaiHttp);

describe('Mapbox API', () => {
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  /*
  * /GET
  */
  describe('/GET mapbox', () => {
    xit('should grab coordinates for a single user on /mapbox/:id GET', done => {
      const newUser = new User({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save((err, data) => {
        chai.request(server)
          .get(`/api/mapbox/${data.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('latitude');
            res.body.should.have.property('longitude');
            res.body.should.be.a('object');
            done();
          });
      });
    });
  });
});
