var mongoose = require('mongoose')

var tagViewSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tagName: {
    type: String,
    trim: true,
    unique: true
  },
  viewTotal:{},
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  strict: false
}, {timestamps: true});



tagViewSchema.index({createdAt: 1},{expireAfterSeconds: 1200000});

module.exports = tagViewSchema
