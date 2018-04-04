var auto = require('run-auto')
var mongoose = require('mongoose')
var imgurGals = mongoose.model('imgurGal')
var wikis = mongoose.model('wiki')
var tagViews = mongoose.model('tagView')
var _ = require('lodash')
var axios = require('axios')
var moment = require('moment')
var async = require('async')
var await = require('await')
const wiki = require('wikijs').default
let statState = {}
require('dotenv').config()
var BBPromise = require("bluebird");
const cl = (console.log)
getGalsFromImgur()
setInterval(getGalsFromImgur, (60 * 60 * 1000))
exports.getImgurgal = function (req, res, next) {
    auto({
      imgurGals: function (cb) {
        imgurGals
          .find()
          .limit(500)
          .exec(cb);
      }
    }, function (err, results) {
      if (err) return next(err)
      let justGals = results.imgurGals.map(function(doc) {
        return doc.gal;
      })
      return res.status(200).send(justGals)
    })
};
function getGalsFromImgur() {
console.log('LEEEEEEEEEEEEEEEROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOY JEEEEEEEEEEEEEEENNKKKKKKKKKIIIIIIIIIIIIIIIIIIIIIIIIIIIINS')
  function getGals() {
    console.log('in getGals')
    const request = axios({
      method: 'GET',
      url: `https://api.imgur.com/3/gallery/hot/1?showViral=true&mature=false&album_previews=true`,
      headers: {
        authorization: process.env.IMGUR_TOKEN
      }
    })
    return request
      .then(request => {
        return request.data.data
      })
      .then(data => {
        let filterArr = _.reject(data, function(g) {
          return (g.link && g.cover)
        })
        statState.picless = filterArr.length
        filterArr = []
        filterArr = _.reject(data, function(g) {
          return g.images_count == 1
        })
        statState.multipics = filterArr.length
        filterArr = []
        filterArr = _.reject(data, function(g) {
          return g.tags.length > 0
        })
        statState.tagless = filterArr.length
        filterArr = []
        statState.batchTime = ("Today, ", moment().local().format('hh:mm A'))
        statState.wikiless = _.random(93,138)
        console.log(statState)
        return data
      })
      .then(data => _.filter(data, function(g) {
        return (g.link && g.images_count == 1 && g.tags.length > 0)
      })).then(
        response => filterExisting(response),
        err => console.log('getGals2 ', err)
      ).catch(console.log())
    console.log('out getGals')
  };
  function filterExisting(galsSlice) {
    console.log('in filterViews')
    console.log('newGals starting length:', galsSlice.length)
    auto({
      imgurGals: function(cb) {
        imgurGals
          .find({})
          .exec(cb)
      }
    }, function(err, results) {
      if (err) console.log('filterViews, existingGalId err: ', err)
      let existingGalIds = results.imgurGals.map(function(doc) {
        return doc.gal.id;
      })
      console.log('egL: ', existingGalIds.length)
      console.log('egi1: ', existingGalIds)
      let duplicateGals = []
      for (let gal of galsSlice) {
        if (_.includes(existingGalIds, gal.id)) {
          console.log('gl1: ', galsSlice.length)
          _.remove(galsSlice, gal)
          console.log('gl2: ', galsSlice.length)
          duplicateGals.push(gal.id)
        }
      }
      console.log(...duplicateGals, ' already entered in mongodb.')
      console.log('newGals length after mongo _.intersection:', galsSlice.length)
      filterViews(galsSlice)
    })
  };
function calcGals(func, gals) {
  console.log(func, 'CALCGALS func', gals.length)
}
  function filterViews(galsSlice) {
    calcGals('filterviews', galsSlice)
    let newArray = []
    let allPromises = []
    let viewsSlice = _.cloneDeep(galsSlice)
    console.log('viewsSlice length after mongo _.intersection:', viewsSlice.length)
    for (let gal of viewsSlice) {
      let tags = gal.tags
      let newTags = []
      for (let tag of tags) {
        let shittyTags = ['crews_control', 'funny', 'aww', 'awesome', 'cute', 'cosplay', 'eat_what_you_want', 'awesome', 'meme',
        shittyTags.map(function(shit) {
          let cap = _.upperFirst(shit)
          shittyTags.push(cap)
        })
        if (!_.includes(shittyTags, tag.name)) {
          newTags.push(tag)
        };
        gal.tags = _.cloneDeep(newTags)
      }
    }
    console.log('out Filterviews')
    getViews(viewsSlice)
  };
  function getViews(viewsSlice) {
    calcGals('in getViews viewSlice.length', viewsSlice.length)
    console.log('in getViews')
    let newGals = _.cloneDeep(viewsSlice) //noprod
    const now = (moment().format('YYYYMMDDHH'))
    const threemonthsago = (moment().subtract(4, 'months').format('YYYYMMDDHH'))
    let galsWithViews = []
    for (let gal of newGals) {
      _.set(gal, 'pArray', [])
      _.set(gal, 'tagsWithViewObjs', [])
      let tags = gal.tags
      for (let tag of tags) {
      let tagName = tag.name
        let p = axios({
            method: 'GET',
            url: `http://138.197.206.10:3000/api/tagView/${tagName}`,
            user: process.env.POST_ID
          })
            .then(r => {
            return new Promise(resolve => {
              resolve(Object.assign({}, gal, {fromCache: true}, {tagsWithViewObjs: [{tagName: r.tagName}, {viewTotal}]}))
            })
            })
            .catch(() => {})
            gal.pArray.push(p)
      }
    }
    for (let gal of newGals) {
      let tags = gal.tags
      for (let tag of tags) {
        if (!_.includes(gal.tagsWithViewObjs, tag.name)) {
        let p = axios({
            method: 'GET',
            url:
            headers: []
          })
            .then(r => {
            return new Promise(resolve => {
              resolve(Object.assign({}, gal, {tagsWithViewObjs: [r]}))
            })
            })
            .catch(() => {})
            gal.pArray.push(p)
        }
      }
    }
    console.log('newGals.length: ', newGals.length)
    async function resolvePs(gals) {
      calcGals('resolvePs', gals)
      let promiseArrs = gals.map(gal => gal.pArray)
      let flatPs = _.flattenDeep(promiseArrs)
      let galsWithViews = []
      await Promise.all(flatPs).then(r => gals = r).catch(() => null)
          for (let gal of gals) {
            if (!_.isUndefined(gal)) {
              if (!gal.tagsWithViewObjs || gal.tagsWithViewObjs.length == 0) {
                console.log(gal.id, " has no tags with views.")
              } else {
                galsWithViews.push(gal)
              }
            }
        }
        let finalViewGals = _.uniq(galsWithViews)
        console.log('finalViewGals.length:', finalViewGals.length)
        console.log('leaving getViews')
        getTopTag(finalViewGals)
    }
    resolvePs(newGals)
};
  function getTopTag(gals) {
    let dataArr = gals.map(gal => gal.tagsWithViewObjs)
    let viewsSlice = _.cloneDeep(gals)
    let uniqArr = []
    let finalTagsSlice = []
    for (let g of viewsSlice) {
      g.viewTotal = 0
      for (let tagObj of g.tagsWithViewObjs) {
        let tagName
        let viewTotal
        if (tagObj) {
          if (tagObj.tagName && tagObj.viewTotal) {
            console.log('Found in cacheViews:', tagObj.tagName)
            tagName = tagObj.tagName
            viewTotal = tagObj.viewTotal
          } else {
          let months = tagObj.data.items
          viewTotal = _.sumBy(months, 'views')
          tagName = months[0].article
          if (!_.includes(uniqArr, tagName)) {
            uniqArr.push(tagName)
            tagViews.create({'tagName': tagName, 'viewTotal': viewTotal}, function(err, success) {
              if (err) {
              } else {
                console.log("tagViews", tagName, "INSERT OK");
              }
            })
          }
          }
          if (g.viewTotal < viewTotal) {
            g.viewTotal = viewTotal
            g.topTag = tagName
            finalTagsSlice.push(g)
          }
        }
      }
    }
    let theSlice = _.uniq(finalTagsSlice)
    console.log('assholes', viewsSlice.length - theSlice.length, viewsSlice.length, theSlice.length)
    getWikiContent(theSlice)
  };
  function getWikiContent(tagsSliceDupes) {
    let tagsSlice = _.uniq(tagsSliceDupes)
    console.log('in getWikiContent', 'tagsSlice.length', tagsSlice.length)
    let finalWikiSlice = []
    BBPromise.map(tagsSlice, function(gal) {
        let topTag = gal.topTag
        let p = axios({
          method: 'GET',
          url: `http://138.197.206.10:3000/api/wiki/${topTag}`,
          user: process.env.POST_ID
        }).then(p => {
        _.set(gal, 'wikiContent', p.content)
        _.set(gal, 'wikiPic', p.pic)
      })
        return p
      }, {
        concurrency: 75
      }
      )
      .then(() => {
        for (let gal of tagsSlice) {
          if ((!_.isNull(gal.wikiContent)) && (!_.isNull(gal.wikiPic))) {
            console.log(`got ${gal.topTag} from wiki cache`)
            finalWikiSlice.push(gal)
            console.log(`removing ${gal.topTag} from tagslice. Before: ${tagsSlice.length}`)
            _.remove(tagsSlice, gal)
            console.log(`After: ${tagsSlice.length}`)
          }
        }
      })
      .then(tagsSlice => {
      console.log(finalWikiSlice.length, 'gals populated with cached wiki content')
      console.log(tagsSlice.length, 'gals left for wikipedia content get')
      getPix(tagsSlice, finalWikiSlice)
    })
    .catch(() => null)
  }
function getPix(tagsSlice, finalWikiSlice) {
    console.log(`in getPix`)
    let wikiPicSlice = []
    BBPromise.map(tagsSlice, function(gal) {
          let topTag = gal.topTag
          gal.wikiPicP = wiki().page(topTag).then(page => page.mainImage()).then(val => gal.wikiPic = val).catch(() => null)
          return gal.wikiPicP
        }, {
          concurrency: 135
        })
        .then(() => {
          console.log('line 551 - !_.has gal loop')
          for (let gal of tagsSlice) {
            if (!_.has(gal, 'wikiPic')) {
              console.log('Wikipage for:', gal.topTag, ' REJECTED because !pic.')
            } else {
              wikiPicSlice.push(gal)
            }
          }
        return wikiPicSlice
      }).then (wikiPicSlice => {
        getWikiContentAsync(wikiPicSlice, finalWikiSlice)
      })
    };
      function getWikiContentAsync(wikiPicSlice, finalWikiSlice) {
        let finalWikiTitles = []
        BBPromise.map(wikiPicSlice, function(gal) {
          let topTag = gal.topTag
          gal.wikiP = wiki().page(topTag).then(page => page.summary()).then(val => _.set(gal, 'wikiContent', val)).catch(() => {})
          console.log('got:', gal.topTag, 'wiki content promise')
          return gal.wikiP
        }, {
          concurrency: 135
        })
      .then(() => {
        for (let gal of wikiPicSlice) {
          let html = gal.wikiContent
          let pic = gal.wikiPic
          console.log('Checking wikipage for:', gal.topTag)
          if (!_.has(gal, 'wikiContent') || gal.wikiContent.length <= 60) {
            console.log('Wikipage for:', gal.topTag, ' REJECTED because !html.')
              return finalWikiSlice
          }
          finalWikiTitles.push({
            title: gal.topTag,
            content: html,
            pic: pic,
            user: process.env.POST_ID
          })
          finalWikiSlice.push(gal)
        }
        return finalWikiSlice
      })
      .then(() => {
        calcGals('608 pre wiki mongo findOne', finalWikiSlice)
        calcGals('608 pre wiki mongo findOne uniqWikiTitles', finalWikiTitles)
        let uniqWikiTitles = _.cloneDeep(finalWikiTitles)
        saveForLater(uniqWikiTitles)
        saveGalsToDB(finalWikiSlice)
      })
      .catch(e => console.log(e))
  };
  async function saveForLater(wikiArr) {
    for (let wiki of wikiArr) {
     if (_.has(wiki, 'pic') || wiki.content.length <= 60) {
      await wikis.create(wiki), function(err, success) {
        if (err) {
        } else {
          console.log("wikis", wikiTitle, "INSERT OK");
        }
      }
   }
    }
  };
  async function saveGalsToDB(gals) {
    console.log('gals.length: ', gals.length)
    let slimDocs = []
    for (let gal of gals) {
      if (_.has(gal, 'wikiPic')) {
      let slimGal = _.pick(gal, 'id', 'title', 'cover', 'cover_width', 'cover_height', 'images', 'link', 'topTag', 'wikiContent',
      let doc = {}
      doc.title = slimGal.title
      doc.gal = _.cloneDeep(slimGal)
      doc.user = process.env.POST_ID
      doc.gal.stats = statState
      doc.gal.stats.approved = _.random(4, 15) //noprod
      slimDocs.push(doc)
     }
    }
    let uniqSlimDocs = _.uniq(slimDocs)
    console.log('uniqSlimDocs.length', uniqSlimDocs.length)
    await imgurGals.create(uniqSlimDocs)
    .then(console.log('AT LEAST I GOT CHICKEN @ ', moment().format('hh:mm A') + '.'))
    .catch(() => null)
}
  getGals()
} // getGalsFromImgur close
exports.postImgurgal = function (req, res, next) {
  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }
  req.body.user = req.user._id
  imgurGals.create(req.body, function (err, data) {
    if (err) return next(err)
    return res.status(201).send(data)
  })
}
exports.paramImgurgal = function (req, res, next, id) {
  req.assert('imgurGalId', 'Your Imgurgal ID cannot be blank').notEmpty()
  req.assert('imgurGalId', 'Your Imgurgal ID has to be a real id').isMongoId()
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
    imgurGal: function (cb) {
      imgurGals
        .findOne({_id: id})
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    req.imgurGal = results.imgurGal
    next()
  })
}
