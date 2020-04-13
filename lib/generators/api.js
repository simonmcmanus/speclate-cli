'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var writeFile = require('../write-file')
var path = require('path')
var log = require('../log')

module.exports = function (spec, speclate, files, callback) {
  speclate.site(spec, files, function (error, files) {
    if (error) {
      throw error()
    }
    async.each(files, function (item, next) {
      var compiledSpec = spec[item.name]
      if (item.name === '/') {
        item.name = '/index.html'
      }
      var partPath = path.join(spec.options.outputDir, item.name.slice(0, -4) + 'json')
      log.debug(path.join(process.cwd(), partPath))
      writeFile(path.join(process.cwd(), partPath), JSON.stringify(compiledSpec, null, 4), function (err) {
        if (err) {
          return next(err)
        }
        log.debug(`written: ${partPath}`)
        next()
      })
    }, function (err, data) {
      log.success('ok')
      callback(err, data)
    })
  })
}
