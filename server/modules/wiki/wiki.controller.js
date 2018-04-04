var auto = require('run-auto')
var mongoose = require('mongoose')
var wikis = mongoose.model('wiki')
var _ = require('lodash')
require('dotenv').config()

exports.getWiki = function (req, res, next) {
  auto({
    wikis: function (cb) {
      wikis
        .find()
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    return res.status(200).send(results.wikis)
  })
}
exports.deleteWiki = function (req, res, next) {
  req.wiki.remove(function () {
    res.status(204).send()
  })
}
exports.postWiki = function (req, res, next) {
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
  wikis.create(req.body, function (err, data) {
    if (err) return next(err)
    return res.status(201).send(data)
  })
}
exports.putWiki = function (req, res, next) {
  req.wiki = _.merge(req.wiki, req.body)
  req.wiki.save(function (err) {
    console.log('err', err)
    if (err) return next(err)
    return res.status(200).send(req.wiki)
  })
}

exports.getWikiByTitle = function (req, res, next) {
  res.send(req.wiki)
}
exports.paramWiki = function (req, res, next, wikiTitle) {

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
    wiki: function (cb) {
      wikis
        .findOne({title: wikiTitle})
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    req.wiki = results.wiki
    next()
  })
}
