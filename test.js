const chai = require('chai');
const request = require('supertest')

chai.should();
chai.use(require('chai-json-schema'));
const { performance } = require('perf_hooks');

const baseUrl = "https://swapi.dev/api"
const {expectedJsonSchema} = require('./expectedJsonSchema');
const { expectedResponse } = require('./expectedResponse');

describe('Planets API', (done) => {
    it('Verify response headers', async () => {
        const res = await request(baseUrl).get('/planets/3/')
        res.header["vary"].should.equal('Accept, Cookie')
        res.header["allow"].should.equal('GET, HEAD, OPTIONS')
        res.header["content-type"].should.equal('application/json')
    })

    it('Verify response data', async () => {
        const res = await request(baseUrl).get('/planets/3/')
        res.body.should.deep.include(expectedResponse)
    })

    it('Verify the json schema', async () => {
        const res = await request(baseUrl).get('/planets/3/')
        res.body.should.be.jsonSchema(expectedJsonSchema)
    })

    it('Verify invalid http method is caught', async () => {
        const payload = {
            "name": "Automated testing",
            "Completed": true
        }
        const res = await request(baseUrl).post('/planets/3/').send(payload)
        res.statusCode.should.equal(405)
        const message = JSON.parse(res.error.text).detail
        message.should.equal("Method 'POST' not allowed.")
    })

    it('Verify the response time is less than 3ms', async () => {
        const startTime = performance.now()
        const res = await request(baseUrl).get('/planets/3/')
        const endTime = performance.now()
        let timeTaken = endTime - startTime
        timeTaken.should.not.be.greaterThan(3)
    })

    it.only('Verify the name returns a different value', async () => {
        const { mockName } = require('./mock');
        const res = await request(baseUrl).get('/planets/3/')
        res.body.name.should.not.equal("Yavin IV")
    })
})