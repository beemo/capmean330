var imgurGal = require('./imgurGal.controller.js')

module.exports = function (app, auth, mail, settings, models) {
  // GET
  app.get('/api/imgurGal/', imgurGal.getImgurgal)

  // app.post('/api/getNewImgurgals/', imgurGal.getNewImgurgals)

  // app.get('/api/imgurGal/:imgurGalId', imgurGal.getImgurgalById)
  // POST
  // app.post('/api/getGalsFromImgur', imgurGal.getGalsFromImgur)
  // // PUT
  // app.put('/api/imgurGal/:imgurGalId', imgurGal.putImgurgal)
  // // DELETE
  // app.delete('/api/imgurGal/:imgurGalId', imgurGal.deleteImgurgal)
  // PARAM
  app.param('imgurGalId', imgurGal.paramImgurgal)
}
