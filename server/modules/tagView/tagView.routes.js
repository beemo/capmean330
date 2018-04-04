var tagView = require('./tagView.controller.js')

module.exports = function (app, auth, mail, settings, models) {
  // GET
  app.get('/api/tagView/', tagView.getTagview)
  app.get('/api/tagView/:getTagviewByName', tagView.getTagviewByName)
  // POST
  app.post('/api/tagView', tagView.postTagview)
  // PUT
  app.put('/api/tagView/:tagViewId', tagView.putTagview)
  // DELETE
  app.delete('/api/tagView/:tagViewId', tagView.deleteTagview)
  // PARAM
  app.param('tagViewId', tagView.paramTagview)
}
