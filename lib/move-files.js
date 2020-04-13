'use strict'

/**
 * Generates a static site.
 */
var async = require('async')
var schema = require('speclate-schema')
var moveFile = require('./move-file')
var log = require('./log')

module.exports = function (spec, callback) {
  spec = schema.validate(spec)
  spec = spec.options.scanSpecForFiles(spec, false)
  var files = spec.options.files.concat(getPagesAndComponents(spec), spec.options.appCacheFiles)
  var uniqueFiles = files.filter(function (item, pos) {
    return files.indexOf(item) === pos
  })
  async.each(uniqueFiles, function (file, next) {
    moveFile(process.cwd() + '/' + file, spec.options, next)
    log.debug(`written ${file}`)
  }, function (err, data) {
    log.success('ok')
    callback(err, data)
  })
}

function getPagesAndComponents (spec) {
  var files = []
  Object.keys(spec).forEach(function (page) {
    var pageName = spec[page].page
    if (pageName) {
      files.push('pages/' + pageName + '/' + pageName + '.html')
      for (var selector in spec[page].spec) {
        var component = spec[page].spec[selector].component
        if (component) {
          files.push('components/' + component + '/' + component + '.html')
          // supporting states
          var states = spec[page].spec[selector].states
          for (var state in states) {
            var stateComponent = states[state].component
            if (stateComponent) {
              files.push('components/' + stateComponent + '/' + stateComponent + '.html')
            }
          }
     

        }
      }
    }
  })
  return files
}
