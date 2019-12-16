'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var writeFile = require('../write-file')
var path = require('path')
var log = require('../log')

module.exports = function (spec, speclate, callback) {

  speclate.site(spec, function (error, files) {
    if (error) {
      throw error()
    }
    async.each(files, function (item, next) {
      var compiledSpec = spec[item.name]
      if (item.name === '/') {
        item.name = '/index.html'
      }
      var partPath = path.join(spec.options.outputDir, item.name.slice(0, -4) + 'json')
      async.parallel([
        function (cb) {
          // this should eventually sit behind a flag.
          var oldPath = path.join(spec.options.outputDir, '/api/speclate' + item.name.slice(0, -4) + 'json')
          writeFile(path.join(process.cwd(), oldPath), JSON.stringify(compiledSpec, null, 4), function (err) {
            if (err) {
              return cb(err)
            }
            log.debug('  written: ' + oldPath + '(legacy)')
            cb()
          })
        },
        function (cb) {
          writeFile(path.join(process.cwd(), partPath), JSON.stringify(compiledSpec, null, 4), function (err) {
            if (err) {
              return cb(err)
            }
            log.debug('  written: ' + partPath + '(new api path)')
            cb()
          })
        }
      ], next)
    }, function (err, data) {
      log.success('ok')
      callback(err, data)
    })
  })
}
