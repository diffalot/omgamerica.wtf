const tape = require('tape')

const server = require('./index')

tape('can search for representatives', function (t) {
  let request = {
    method: 'POST',
    url: '/lookup',
    payload: { address: '1600 Pennsylvania Ave NW, Washington, DC 20006' }
  }
  server.inject(request, function (response) {
    t.equal(response.statusCode, 200, 'received 200')
    t.equal(JSON.parse(response.payload).length, 7, 'received 7 representatives')
    server.stop()
    t.end()
  })
})

