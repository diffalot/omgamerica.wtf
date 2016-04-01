'use strict'

var Promise = require('bluebird')

var Geocoder = require('node-geocoder')('google', 'http')
var geocoder = Promise.promisifyAll(Geocoder)

var OpenStates = require('openstates')

var db = require('./redis-connection')

var sunlightKey = process.env.SUNLIGHT_KEY || require('../settings').sunlightKey

var findRepsForAddress = function findRepsForAddress (address) {
  var openstates = new OpenStates(sunlightKey)
  return geocoder.geocode(address)
  .then(function (geocode) {
    return {
      latitude: geocode[0].latitude,
      longitude: geocode[0].longitude,
      confidence: geocode[0].extra.confidence
    }
  })
  .then(function (location) {
    return new Promise(function (resolve, reject) {
      if (location.confidence <= 0.7) {
        reject({message: 'We cannot find any representatives for that address.  Please try a different address.'})
      } else {
        resolve(location)
      }
    })
  })
  .then(function (location) {
    return new Promise(function (resolve, reject) {
      openstates.geoLookup(location.latitude, location.longitude, function (error, representatives) {
        if (error) reject(error)
        resolve(representatives)
      })
    })
  })
  .then(function (representatives) {
    var reps = []
    for (var i = 0; i < representatives.length; ++i) {
      reps.push(representatives[i].id)
    }
    return reps
  })
  .then(function (representatives) {
    return db.getManyReps(representatives)
  })
}

module.exports = findRepsForAddress
