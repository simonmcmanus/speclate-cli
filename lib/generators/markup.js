'use strict'

/**
 * Generates a static site.
 */
var async = require('async')
var validator = require('../validators')
var writeFile = require('../write-file')
var notify = require('../watch/notify')
var minifiy = require('../postprocessors/html-minify')
var log = require('../log')

module.exports = function (spec, options, speclate, files, callback) {
  speclate.site(spec, files, function (error, files) {
    if (error) {
      return callback(error)
    }
    async.each(files, function (item, next) {
      if (item.name === '/') {
        item.name = '/index.html'
      }
      var filePath = process.cwd() + '' + options.outputDir + item.name
      if (options.validate && options.validate.w3c) {
        validator(item, function (err) {
          if (err) {
            if (options.validate.w3c === 'error') {
              notify(err)
              return next(err)
            } else if (options.validate.w3c === 'warn') {
              notify(err)

              console.log('w3c Validation error: ' + err)
            }
          }
          log.debug('  writing: ' + options.outputDir + item.name)
          writeFile(filePath, minifiy(item.markup), next)
        })
      } else {
        log.debug('  writing: ' + options.outputDir + item.name)
        writeFile(filePath, minifiy(item.markup), next)
      }
    }, function (err, data) {
      log.success('ok')
      callback(err, data)
    })
  })
}
