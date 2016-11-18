'use strict'

var Hapi = require('hapi')

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
  sunlightKey: process.env.SUNLIGHT_KEY || require('./settings').sunlightKey
})

function statsLoop () {
  return getBillStats()
  .then(function (stats) {
    billStats = stats
    console.log(stats)
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
  sunlightKey: process.env.SUNLIGHT_KEY || require('./settings').sunlightKey
})

server.route({
  method: 'POST',
  path: '/lookup',
  handler: function (req, reply) {
    console.log(req.payload)
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

var callWithTwilio = require('./lib/call-with-twilio').call({
  twilioSid: process.env.TWILIO_SID || require('./settings').twilioSid,
  twilioToken: process.env.TWILIO_TOKEN || require('./settings').twilioToken
})

server.route({
  method: 'POST',
  path: '/call',
  handler: function (req, reply) {
    console.log(req.payload)
    callWithTwilio(req.payload.number)
    .then(function (reps) {
      console.log('CALLED', reps)
      reply(reps)
    })
    .catch(function (error) {
      console.log('error:', error.message)
      reply(error)
      throw new Error(error)
    })
  }
})

var retreiveScript = require('./lib/call-with-twilio').retreiveScript({
  twilioSid: process.env.TWILIO_SID || require('./settings').twilioSid,
  twilioToken: process.env.TWILIO_TOKEN || require('./settings').twilioToken
})

server.route({
  method: ['GET', 'POST'],
  path: '/scripts/{uuid}',
  handler: function (req, reply) {
    retreiveScript(req.params.uuid)
    .then(function (script) {
      console.log('SCRIPT', script)
      reply(script)
      .header('Content-Type', 'application/xml')
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
