const chai = require('chai');
const request = require('supertest')

chai.should();
chai.use(require('chai-json-schema'));
const { performance } = require('perf_hooks');

const baseUrl = "https://swapi.dev/api"
const {expectedJsonSchema} = require('./expectedJsonSchema');

const date = new Date();

describe('Planets API', (done) => {
    it('Verify response headers', async () => {
        const res = await request(baseUrl).get('/planets/3/')
        //res.header["date"].should.equal(date.toUTCString())
        res.header["vary"].should.equal('Accept, Cookie')
        res.header["allow"].should.equal('GET, HEAD, OPTIONS')
        res.header["content-type"].should.equal('application/json')
        console.log(res.header)
    })

    it('Verify response data', async () => {
        const res = await request(baseUrl).get('/planets/3/')
        res.body["name"].should.have.equal("Yavin IV")
        res.body["rotation_period"].should.have.equal("24")
        res.body["orbital_period"].should.have.equal("4818")
        res.body["diameter"].should.have.equal("10200")
        res.body["climate"].should.have.equal("temperate, tropical")
        res.body["gravity"].should.have.equal("1 standard")
        res.body["terrain"].should.have.equal("jungle, rainforests")
        res.body["surface_water"].should.have.equal("8")
        res.body["population"].should.have.equal("1000")
        res.body["residents"].should.be.empty
        res.body["films"][0].should.have.equal("https://swapi.dev/api/films/1/")
        res.body["created"].should.have.equal("2014-12-10T11:37:19.144000Z")
        res.body["edited"].should.have.equal("2014-12-20T20:58:18.421000Z")
        res.body["url"].should.have.equal("https://swapi.dev/api/planets/3/")
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
        var startTime = performance.now()
        const res = await request(baseUrl).get('/planets/3/')
        var endTime = performance.now()
        let timeTaken = endTime - startTime
        timeTaken.should.not.be.greaterThan(3)
    })

    it('Verify the name returns a different value', () => {
        const { mockName } = require('./mock');
        const body = JSON.parse(mockName.interceptors[0].body)["name"]
        body.should.not.equal("Yavin IV")
    })
})