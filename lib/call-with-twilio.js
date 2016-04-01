'use strict'

var createUUID = require('node-uuid').v4

var Twilio = require('twilio')

var hostUrl = process.env.HOST_URL || require('../settings').hostUrl

var db = require('./redis-connection')

var generateSteps = require('./call-step-generator')

var twilioSid = process.env.TWILIO_SID || require('../settings').twilioSid
var twilioToken = process.env.TWILIO_TOKEN || require('../settings').twilioToken
var twilio = new Twilio.RestClient(twilioSid, twilioToken)

var callWithTwilio = function callWithTwilio (request) {
  var call = {}
  call.options = request
  call.uuid = createUUID()

  return generateSteps(call)
  .then(function (callWithSteps) {
    return db.setCall(callWithSteps.uuid, callWithSteps)
  })
  .then(function () {
    return twilio.incomingPhoneNumbers.list()
  })
  .then(function (numbers) {
    return numbers.incomingPhoneNumbers
  })
  .then(function (twilioNumbers) {
    return twilio.calls.create({
      to: call.options.phone,
      from: twilioNumbers[0].phone_number,
      url: hostUrl + 'scripts/' + call.uuid + '/greeting'
    })
  })
  .then(function () {
    return {message: 'Your phone will begin ringing soon.'}
  })
}

module.exports = callWithTwilio
