#!/usr/bin/env node

'use strict'

const settings = require('../settings')

const secrets = {
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    name: 'ms-wtf-secrets',
    namespace: 'omgamerica'
  },
  type: 'Opaque',
  data: {
    sunlightKey: new Buffer(settings.sunlightKey).toString('base64'),
    twilioSid: new Buffer(settings.twilioSid).toString('base64'),
    twilioToken: new Buffer(settings.twilioToken).toString('base64'),
    billState: new Buffer(settings.bill.state).toString('base64'),
    billYear: new Buffer(settings.bill.year).toString('base64'),
    billQuery: new Buffer(settings.bill.query).toString('base64'),
    stateName: new Buffer(settings.stateName).toString('base64')
  }
}

var yaml = require('js-yaml').safeDump(secrets)

require('fs').writeFileSync(require('path').join(__dirname, '../k8s/ms-wtf-secrets.yml'), yaml)
