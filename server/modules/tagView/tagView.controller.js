var auto = require('run-auto')
var mongoose = require('mongoose')
var tagViews = mongoose.model('tagView')
var _ = require('lodash')

exports.getTagview = function (req, res, next) {
  auto({
    tagViews: function (cb) {
      tagViews
        .find()
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    return res.status(200).send(results.tagViews)
  })
}
exports.deleteTagview = function (req, res, next) {
  req.tagView.remove(function () {
    res.status(204).send()
  })
}
exports.postTagview = function (req, res, next) {
  // req.assert('name', 'The name cannot be blank').notEmpty()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }
  req.body.user = req.user._id
  tagViews.create(req.body, function (err, data) {
    if (err) return next(err)
    return res.status(201).send(data)
  })
}
exports.putTagview = function (req, res, next) {
  req.tagView = _.merge(req.tagView, req.body)
  req.tagView.save(function (err) {
    console.log('err', err)
    if (err) return next(err)
    return res.status(200).send(req.tagView)
  })
}

exports.getTagviewByName = function (req, res, next) {
  res.send(req.tagView)
}
exports.paramTagview = function (req, res, next, name) {
  req.assert('tagViewId', 'Your Tagview ID cannot be blank').notEmpty()
  req.assert('tagViewId', 'Your Tagview ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    console.log(errors)
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }
  auto({
    tagView: function (cb) {
      tagViews
        .findOne({name: name})
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    req.tagView = results.tagView
    next()
  })
}
