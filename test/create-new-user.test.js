const Lab = require('lab')  
const Code = require('code')  
const Hapi = require('hapi')

const lab = (exports.lab = Lab.script())
const { describe, it } = lab
const expect = Code.expect

const createNewUserHandler = require('../src/route-handlers/create-new-user')
const server = new Hapi.Server()

lab.experiment('Create new user', () => {

  lab.beforeEach(() => {
    
    server.route({
      method: 'POST',
      path: '/',
      handler: createNewUserHandler
    })
  })

  lab.test('should generate a system guid', async () => {

    // these must match the route you want to test
    const injectOptions = {
      method: 'POST',
      url: '/',
      payload: {
        name: "Beverly Benedict",
        dob: new Date("3/15/1989").toISOString()
      }
    }

    // wait for the response and the request to finish
    const response = await server.inject(injectOptions)
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).to.equal(200)
    expect(payload.item.name).to.equal('Beverly Benedict')
  })

})