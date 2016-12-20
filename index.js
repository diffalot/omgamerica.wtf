'use strict'

var server = require('./routes')

/*
var callWithTwilio = require('./lib/call-with-twilio').call({
  twilioSid: settings.twilioSid,
  twilioToken: settings.twilioToken
})

server.route({
  method: 'POST',
  path: '/call',
  handler: function (req, reply) {
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
  twilioSid: settings.twilioSid,
  twilioToken: settings.twilioToken
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

*/

server.start()

module.exports = server
