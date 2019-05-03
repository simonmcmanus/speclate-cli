'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var writeFile = require('../write-file')
var path = require('path')
var log = require('../log')

module.exports = function (spec, speclate, files, callback) {
  async.forEachOf(spec, (pageSpec, filename, next) => {
    if (filename === '/') {
      filename = '/index.html'
    }
    var partPath = path.join('docs', filename.slice(0, -4) + 'js')
    log.debug(path.join(process.cwd(), partPath))
    writeFile(path.join(process.cwd(), partPath), 'export default ' + JSON.stringify(pageSpec, null, 4), function (err) {
      if (err) {
        console.log('e', err)
        return next(err)
      }
      log.debug(`written: ${partPath}`)
      next()
    })
  }, function (err, data) {
    log.success('ok')
    callback(err, data)
  })
}
