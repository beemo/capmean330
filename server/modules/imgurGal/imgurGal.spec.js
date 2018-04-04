var assert = require('chai').assert
var request = require('supertest')

describe('Imgurgal', function () {
  describe('GET /api/imgurGal', function () {
    it('should be returning imgurGal', function (done) {
      request('localhost:3000/')
        .get('api/imgurGal')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
