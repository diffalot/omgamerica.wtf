'use strict'

var Hapi = require('hapi')

var server = new Hapi.Server()
server.connection({port: process.env.PORT || 3000})

var billStats
var getBillStats = require('./lib/scrape-bill-stats')
require('./lib/scrape-legislative-contacts.js')
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

var findRepsForAddress = require('./lib/search-for-representatives')
server.route({
  method: 'POST',
  path: '/lookup',
  handler: function (req, reply) {
    console.log('SEARCHING ADDRESS', req.payload)
    findRepsForAddress(req.payload.address)
    .then(function (reps) {
      console.log('REPS FOUND', reps)
      reply(reps)
    })
    .catch(function (error) {
      console.log('error:', error.message)
      reply(error)
      throw new Error(error)
    })
  }
})

var callWithTwilio = require('./lib/call-with-twilio')
server.route({
  method: 'POST',
  path: '/call',
  handler: function (req, reply) {
    console.log('CALL REQUESTED', req.payload)
    callWithTwilio({
      repsToCall: req.payload.representatives,
      phone: req.payload.phone
    })
    .then(function (reps) {
      console.log('RETURN CALL STATUS', reps)
      reply(reps)
    })
    .catch(function (error) {
      console.log('error:', error.message)
      reply(error)
      throw new Error(error)
    })
  }
})

var returnStep = require('./lib/call-step-handler')
server.route({
  method: ['GET', 'POST'],
  path: '/scripts/{uuid}/{step}',
  handler: function (req, reply) {
    console.log('STEP REQUESTED', req.params.uuid, req.params.step, req.payload.Digits)
    returnStep(req.params.uuid, req.params.step, req.payload.Digits)
    .then(function (step) {
      console.log('SENDING STEP', step)
      reply(step)
    })
    .catch(function (error) {
      console.log('error:', error.message)
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
      path: 'public'
    }
  }
})

server.start()
