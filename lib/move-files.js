'use strict'
var async = require('async')
var moveFile = require('./move-file')
var log = require('./log')

module.exports = function (spec, options, callback) {
  spec = options.scanSpecForFiles(spec, false)
  var files = options.files
  var uniqueFiles = files.filter(function (item, pos) {
    return files.indexOf(item) === pos
  })
  async.each(uniqueFiles, function (file, next) {
    moveFile(process.cwd() + '/' + file, options, next)
    log.debug(`written ${file}`)
  }, function (err, data) {
    log.success('ok')
    callback(err, data)
  })
}
