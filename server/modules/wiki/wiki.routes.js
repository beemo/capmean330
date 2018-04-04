var wiki = require('./wiki.controller.js')

module.exports = function (app, auth, mail, settings, models) {
  // GET
  app.get('/api/wiki/', wiki.getWiki)
  app.get('/api/wiki/:wikiTitle', wiki.getWikiByTitle)
  // POST
  app.post('/api/wiki', wiki.postWiki)
  // PUT
  app.put('/api/wiki/:wikiTitle', wiki.putWiki)
  // DELETE
  app.delete('/api/wiki/:wikiTitle', wiki.deleteWiki)
  // PARAM
  app.param('wikiTitle', wiki.paramWiki)
}
