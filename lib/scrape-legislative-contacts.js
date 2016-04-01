'use strict'

var Promise = require('bluebird')
var OpenStates = require('openstates')
var isPhone = require('is-phone')

var db = require('./redis-connection')

var state = process.env.BILL_STATE || require('../settings').bill.state

var sunlightKey = process.env.SUNLIGHT_KEY || require('../settings').sunlightKey
var openstates = new OpenStates(sunlightKey)

var getLegislators = function getLegislators (address) {
  return new Promise(function (resolve, reject) {
    openstates.legSearch({state: state}, function (error, legislators) {
      if (error) reject(error)
      resolve(legislators)
    })
  })
  .then(function (legislators) {
    return legislators
  })
  .then(function (representatives) {
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
      db.client.set('rep-' + representative.id, JSON.stringify(representative))
    }
  })
}

function loop () {
  return getLegislators()
  .then(function () {
    setTimeout(loop, 24 * 60 * 60 * 1000)
  })
}

loop()

module.exports = getLegislators
