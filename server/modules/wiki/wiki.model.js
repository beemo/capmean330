var mongoose = require('mongoose')

var wikiSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true,
    unique: true
  },
  content:{},
  pic: {},
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  strict: false
}, {timestamps: true});

wikiSchema.index({createdAt: 1},{expireAfterSeconds: 604800});

module.exports = wikiSchema
