'use strict'

var redis = require('redis')
var Promise = require('bluebird')
var _ = require('lodash')

var prefixes = {
  rep: 'rep-',
  call: 'call-'
}

Promise.promisifyAll(redis.RedisClient.prototype)

var client = redis.createClient({
  url: process.env.REDIS_URL || require('../settings').redisUrl
})

function getManyReps (array) {
  var promises = []
  if (!array || !array.length) return Promise.resolve()
  for (var i = 0; i < array.length; ++i) {
    promises.push(get(prefixes.rep + array[i]))
  }
  return Promise.all(promises)
  .then(function (reps) {
    if (reps.length === 0) {
      return Promise.reject({code: 'NOREPS', message: 'No representatives found'})
    }
    return _.filter(reps)
  })
}

function setCall (uuid, object) {
  return set(prefixes.call + uuid, object)
}

function getCall (uuid) {
  return get(prefixes.call + uuid)
}

function removeCall (uuid) {
  return remove(prefixes.call + uuid)
}

function get (uuid) {
  return client.getAsync(uuid)
  .then(function (data) {
    return JSON.parse(data)
  })
}

function set (uuid, object) {
  return client.setAsync(uuid, JSON.stringify(object))
}

function remove (uuid) {
  return client.delAsync(uuid)
}

module.exports = {
  client: client,
  get: get,
  set: set,
  remove: remove,
  getManyReps: getManyReps,
  setCall: setCall,
  getCall: getCall,
  removeCall: removeCall
}
