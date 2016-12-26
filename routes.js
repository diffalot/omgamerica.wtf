'use strict'

var Hapi = require('hapi')

var settings = require('./settings')

var server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

var billStats
var getBillStats = require('./lib/bill-votes')({
  sunlightKey: settings.sunlightKey
})

function statsLoop () {
  return getBillStats()
  .then(function (stats) {
    billStats = stats
  })
  .then(function () {
    setTimeout(statsLoop, 15 * 60 * 1000)
  })
}

statsLoop()

server.route({
  method: 'GET',
  path: '/stats',
  handler: function (req, reply) {
    reply(billStats)
  }
})

var findRepsForAddress = require('./lib/find-reps')({
  sunlightKey: settings.sunlightKey
})

server.route({
  method: 'POST',
  path: '/lookup',
  handler: function (req, reply) {
    findRepsForAddress(req.payload.address)
    .then(function (reps) {
      reply(reps)
    })
    .catch(function (error) {
      reply(error)
      throw new Error(error)
    })
  }
})

server.register(require('inert'))

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'dist'
    }
  }
})

module.exports = server
