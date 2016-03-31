/* global angular */
'use strict'

angular.module('ContactApp', ['ngRoute'])
.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/views/lookup.html',
    controller: 'LookupController',
    controllerAs: 'Lookup'
  })
})
.controller('LookupController', function (LookupService) {
  var self = this
  LookupService.loadStats()
  .then(function (stats) {
    self.stats = stats.data
    console.log(self)
  })
  self.lookup = function () {
    LookupService.lookup(self.address)
    .success(function (data) {
      self.representatives = data
    })
  }
  self.votedYes = function (repID) {
    var found = false
    for (var i = 0; i < self.stats.yes.length; ++i) {
      if (self.stats.yes[i].leg_id === repID) {
        found = true
      }
    }
    return found
  }
  self.votedNo = function (repID) {
    var found = false
    for (var i = 0; i < self.stats.no.length; ++i) {
      if (self.stats.no[i].leg_id === repID) {
        found = true
      }
    }
    return found
  }
  self.votedOther = function (repID) {
    var found = false
    for (var i = 0; i < self.stats.other.length; ++i) {
      if (self.stats.other[i].leg_id === repID) {
        found = true
      }
    }
    return found
  }
  self.sponsored = function (repID) {
    var found = false
    for (var i = 0; i < self.stats.sponsors.length; ++i) {
      if (self.stats.sponsors[i].leg_id === repID) {
        found = true
      }
    }
    return found
  }
})
.service('LookupService', function ($http) {
  var self = this
  self.lookup = function (address) {
    return $http({
      method: 'POST',
      url: '/lookup',
      data: {address: address}
    })
  }
  self.loadStats = function () {
    return $http({
      method: 'GET',
      url: '/stats'
    })
    .success(function (data) {
      return data
    })
  }
})
