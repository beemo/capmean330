var assert = require('chai').assert
var request = require('supertest')

describe('Wiki', function () {
  describe('GET /api/wiki', function () {
    it('should be returning wiki', function (done) {
      request('localhost:3000/')
        .get('api/wiki')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
