var assert = require('chai').assert
var request = require('supertest')

describe('Tagview', function () {
  describe('GET /api/tagView', function () {
    it('should be returning tagView', function (done) {
      request('localhost:3000/')
        .get('api/tagView')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
