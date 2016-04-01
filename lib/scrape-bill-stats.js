'use strict'

var Promise = require('bluebird')
var OpenStates = require('openstates')

var bill = {}
bill.state = process.env.BILL_STATE || require('../settings').bill.state
bill.year = process.env.BILL_YEAR || require('../settings').bill.year
bill.query = process.env.BILL_QUERY || require('../settings').bill.query

var sunlightKey = process.env.SUNLIGHT_KEY || require('../settings').sunlightKey

var getBillStats = function getBillStats (address) {
  var openstates = new OpenStates(sunlightKey)

  return new Promise(function (resolve, reject) {
    openstates.billDetail(bill.state, bill.year, bill.query, function (error, bill) {
      if (error) reject(error)
      var stats = {
        yes: [],
        no: [],
        other: [],
        sponsors: bill.sponsors
      }
      for (var i = 0; i < bill.votes.length; ++i) {
        var votes = bill.votes[i]
        for (var y = 0; y < votes.yes_votes.length; ++y) {
          stats.yes.push(votes.yes_votes[y])
        }
        for (var n = 0; n < votes.no_votes.length; ++n) {
          stats.no.push(votes.no_votes[n])
        }
        for (var o = 0; o < votes.other_votes.length; ++o) {
          stats.other.push(votes.other_votes[o])
        }
      }
      resolve(stats)
    })
  })
}

module.exports = getBillStats
