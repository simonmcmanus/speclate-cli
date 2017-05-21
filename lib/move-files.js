'use strict'

/**
 * Generates a static site.
 */
var async = require('async')
var schema = require('speclate-schema')
var moveFile = require('./move-file')
var chalk = require('chalk')

module.exports = function (spec, callback) {
  spec = schema.validate(spec)

  spec = spec.options.scanSpecForFiles(spec, false)
  spec.options.files.push(
    'pages/layout.html'
  )
  var files = spec.options.files.concat(getPagesAndComponents(spec), spec.options.appCacheFiles)


  var uniqueFiles = files.filter(function (item, pos) {
    return files.indexOf(item) === pos
  })
  async.each(uniqueFiles, function (file, next) {
    moveFile(process.cwd() + '/' + file, spec.options, next)
    console.log(chalk.grey('  written: ', file))
  }, function (err, data) {
    console.log(chalk.green('  ok'))
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
        }
      }
    }
  })
  return files
}
