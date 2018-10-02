const Lab = require('lab')  
const Code = require('code')  
const Hapi = require('hapi')

const lab = (exports.lab = Lab.script())
const { describe, it } = lab
const expect = Code.expect

const deleteUserHandler = require('../src/route-handlers/delete-user-by-id')
const server = new Hapi.Server()

server.route({
  method: 'DELETE',
  path: '/{userId}',
  handler: deleteUserHandler
})

lab.experiment('Delete user', () => {

  lab.test('delete should be a call to update with archived flag set to true', async () => {
    
    server.methods.getUserById = () => Promise.resolve({ id: '123' })
    server.methods.updateUser = (userId, userRecord) => {
      expect(userRecord.archived).to.equal(true)
      return Promise.resolve({})
    }

    // these must match the route you want to test
    const injectOptions = {
      method: 'DELETE',
      url: '/123',
      payload: {
        name: "Beverly Benedict",
        dob: new Date("3/15/1989").toISOString()
      }
    }

    // wait for the response and the request to finish
    const response = await server.inject(injectOptions)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
  })

  lab.test('should return 404 if user already exists', async () => {
    
    server.methods.getUserById = () => Promise.resolve(null)

    // these must match the route you want to test
    const injectOptions = {
      method: 'DELETE',
      url: '/123',
      payload: {
        name: "Beverly Benedict",
        dob: new Date("3/15/1989").toISOString()
      }
    }

    // wait for the response and the request to finish
    const response = await server.inject(injectOptions)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(404)
  })

})