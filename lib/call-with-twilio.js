'use strict'

var createUUID = require('node-uuid').v4
var Promise = require('bluebird')

var Twilio = require('twilio')

var calls = {}

var RetreiveScript = function (options) {
  if (!(this instanceof RetreiveScript)) return new RetreiveScript(options)

  var retreiveScript = function (uuid) {
    return new Promise(function (resolve, reject) {
      var script = new Twilio.TwimlResponse()

      script.say('we called you at ' + calls[uuid].number)

      resolve(script.toString())
    })
  }
  return retreiveScript
}

var CallWithTwilio = function (options) {
  if (!(this instanceof CallWithTwilio)) return new CallWithTwilio(options)

  var twilioSid = options.twilioSid
  var twilioToken = options.twilioToken
  var twilio = new Twilio.RestClient(twilioSid, twilioToken)

  var callWithTwilio = function callWithTwilio (callOptions) {
    callOptions = {}
    callOptions.number = '+16012554393'
    callOptions.targets = [{
      number: '+12027621401'
    }]

    var uuid = createUUID()

    calls[uuid] = callOptions

    var number = callOptions.number
    // var targets = callOptions.targets

    return twilio.incomingPhoneNumbers.list()
    .then(function (numbers) {
      return numbers.incomingPhoneNumbers
    })
    .then(function (twilioNumbers) {
      return twilio.calls.create({
        to: number,
        from: twilioNumbers[0].phone_number,
        url: 'http://mississippi.wtf/scripts/' + uuid
      })
    })
  }

  return callWithTwilio
}

module.exports = {
  call: CallWithTwilio,
  retreiveScript: RetreiveScript
}
