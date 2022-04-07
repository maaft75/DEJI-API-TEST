const nock = require('nock')

const mockName = nock("https://swapi.dev/api").get('/planets/3/').reply(200, {name: "Ayodeji Adedeji"})

module.exports = { mockName }