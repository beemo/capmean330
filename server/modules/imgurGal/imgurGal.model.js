var mongoose = require('mongoose')

var imgurGalSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true,
    unique: true

  },
  gal: {},
  state: {},
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  strict: false
}, {timestamps: true});

imgurGalSchema.index({createdAt: 1},{expireAfterSeconds: 288100});

module.exports = imgurGalSchema


// Wikipage for: Lol  REJECTED because !pic.
// (node:48871) Warning: a promise was created in a handler at /Users/bmo/dev/capnode/server/modules/imgurGal/imgurGal.controller.js:568:19 but was not returned from it, see http://goo.gl/rRqMUw
//     at Function.Promise.map (/Users/bmo/dev/capnode/node_modules/bluebird/js/release/map.js:164:12)
