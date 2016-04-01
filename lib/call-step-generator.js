'use strict'

var Twilio = require('twilio')

var hostUrl = process.env.HOST_URL || require('../settings').hostUrl

var db = require('./redis-connection')

var voiceOptions = {
  voice: 'woman',
  language: 'en-us'
}

function generateRepresentativeSteps (array) {
  var steps = {}
  steps.senator = {}

  steps.senator['1'] = new Twilio.TwimlResponse()
  .say('We will now connect you with your Senator', voiceOptions)
  .toString()

  steps.senator['2'] = new Twilio.TwimlResponse()
  .say('thank you for giving a fuck about mississippi', voiceOptions)
  .toString()

  return steps
}

module.exports = function generateSteps (call) {
  call.steps = {}

  var greeting = {}
  greeting.all = new Twilio.TwimlResponse()
  .pause({length: 1})
  .gather({
    action: hostUrl + 'scripts/' + call.uuid + '/senator',
    finishOnKey: '*'
  }, function (node) {
    node
    .say('Hello, thank you for choosing to contact your state representatives', voiceOptions)
    .pause({length: 0.5})
    .say('press 1 to continue or press 2 to cancel ', voiceOptions)
  }).toString()

  call.steps.greeting = greeting

  return db.getManyReps()
  .then(generateRepresentativeSteps)
  .then(function (steps) {
    for (var property in steps) {
      if (steps.hasOwnProperty(property)) {
        call.steps[property] = steps[property]
      }
    }
    return call
  })
}
