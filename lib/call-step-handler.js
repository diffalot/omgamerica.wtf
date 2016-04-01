'use script'

var db = require('./redis-connection')

var retreiveScript = function (uuid, stepName, digit) {
  return db.getCall(uuid)
  .then(function (call) {
    if (call === null) {
      return Promise.reject({message: 'no call found'})
    }
    if (call.steps[stepName].all) {
      return call.steps[stepName].all
    }
    return call.steps[stepName][digit]
  })
  .then(function (step) {
    if (step) {
      return step
    } else {
      throw new Error({message: 'no step found', uuid: uuid})
    }
  })
}

module.exports = retreiveScript
