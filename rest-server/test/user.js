require('babel-register');
require('babel-polyfill');

let { User } = require('../src/config/database/collections/userCollections');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach( done => {
    User.remove({}, err => {
      done();
    });
  });

  /*
  * /GET
  */
  describe('/GET user', () => {
    it('should list ALL users on /users GET', done => {
      chai.request(server)
        .get('/api/users')
        .end( (err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          expect(res.body).to.be.an('array');
          res.body.length.should.equal(0);
          done();
        });
    });
    
    it('should list a SINGLE user on /users/:id GET', done => {
      let newUser = new User({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save( (err, data) => {
        chai.request(server)
          .get(`/api/users/${data.id}`)
          .end( (err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('name');
            res.body.should.have.property('dob');
            res.body.should.have.property('address');
            res.body.should.have.property('description');
            res.body.name.should.equal('Test User');
            res.body.dob.should.equal('08/27/2018');
            res.body.address.should.equal('Los Angeles');
            res.body.description.should.equal('This is a test');
            res.body._id.should.equal(data.id);
            done();
          });
      });
    });

    it('should NOT fetch a non-existent user on /users/:id GET', done => {
      chai.request(server)
        .get('/api/users/1234567890')
        .end( (err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.should.be.a('object');
          res.should.have.property('error');
          done();
        });
    });
  });

  /*
  * /POST
  */
  describe('/POST user', () => {
    it('should add a user on /users POST when name, dob, address, description provided', done => {
      let user = {
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      };
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end( (err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.should.have.property('dob');
          res.body.should.have.property('address');
          res.body.should.have.property('description');
          res.body.name.should.equal('Test User');
          res.body.dob.should.equal('08/27/2018');
          res.body.address.should.equal('Los Angeles');
          res.body.description.should.equal('This is a test');
          done();
        });
    });

    it('should NOT add a user on /users POST while missing one or more fields', done => {
      let user = {
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles'
      };
      chai.request(server)
        .post('/api/users')
        .send(user)
        .end( (err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });

  /*
  * /PUT
  */
  describe('/PUT user', () => {
    it('should update a user on /users/:id PUT with name, dob, address, description provided', done => {
      let updatedUser = {
        name: 'Updated User',
        dob: '01/01/2000',
        address: 'Hacienda Heights',
        description: 'This is an update'
      };
      let newUser = new User({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save( (err, data) => {
        chai.request(server)
          .put(`/api/users/${data.id}`)
          .send(updatedUser)
          .end( (err, res) => {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
          });
      });
    });

    it('should update a user on /users/:id PUT with one or more fields missing', done => {
      let updatedUser = {
        name: 'Updated Name',
        description: 'This is an update'
      };
      let newUser = new User({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save( (err, data) => {
        chai.request(server)
          .put(`/api/users/${data.id}`)
          .send(updatedUser)
          .end( (err, res) => {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
          });
      });
    });

    it('should NOT update any users on /users/ PUT without specified param', done => {
      let updatedUser = {
        name: 'Updated Name',
        description: 'This is an update'
      };
      let newUser = new User({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save( (err, data) => {
        chai.request(server)
          .put('/api/users/')
          .send(updatedUser)
          .end( (err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  /*
  * /DELETE
  */
  describe('/DELETE user', () => {
    it('should delete a user on /users/:id DELETE with id provided', done => {
      let newUser = new User({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save( (err, data) => {
        chai.request(server)
          .delete(`/api/users/${data.id}`)
          .end( (err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
          });
      });
    });

    it('should NOT delete a user on /users/:id DELETE with invalid id provided', done => {
      let newUser = new User ({
        name: 'Test User',
        dob: '08/27/2018',
        address: 'Los Angeles',
        description: 'This is a test'
      });
      newUser.save( (err, data) => {
        chai.request(server)
          .delete('/api/users/1234567890')
          .end( (err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });
});