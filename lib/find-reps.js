'use strict'

var Promise = require('bluebird')
var isPhone = require('is-phone')

var Geocoder = require('node-geocoder')('google', 'http')
var geocoder = Promise.promisifyAll(Geocoder)

var OpenStates = require('openstates')

var FindRepsByAddress = function (options) {
  if (!(this instanceof FindRepsByAddress)) return new FindRepsByAddress(options)

  var sunlightKey = options.sunlightKey

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
      return representatives
    })
    .then(function (representatives) {
      var repsCleaned = []
      for (var i = 0; i < representatives.length; ++i) {
        var rep = representatives[i]
        var role
        if (rep.chamber === 'upper') {
          role = 'Senator'
        }
        if (rep.chamber === 'lower') {
          role = 'Legislator'
        }
        var representative = {
          numbers: [],
          id: rep.id,
          photo: rep.photo_url,
          firstName: rep.first_name,
          lastName: rep.last_name,
          party: rep.party,
          district: rep.district,
          offices: rep.offices,
          role: role
        }
        for (var property in rep) {
          if (rep.hasOwnProperty(property)) {
            if (property.includes('phone')) {
              if (isPhone(rep[property])) {
                var number = '+1' + rep[property].replace('(', '').replace(')', '').replace('-', '')
                var context = property.replace('+', '').replace('_phone', '')
                if (context === 'bis') {
                  context = 'business'
                }
                representative.numbers.push({
                  number: number,
                  context: context
                })
              }
            }
          }
        }
        if (representative.numbers.length === 0) {
          delete representative.numbers
          representative.asshole = true
        }
        repsCleaned.push(representative)
      }
      return repsCleaned
    })
  }

  return findRepsForAddress
}

module.exports = FindRepsByAddress
