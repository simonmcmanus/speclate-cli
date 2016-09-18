'use strict'

/**
 * Generates a static site.
 */
var async = require('async')
var schema = require('./schema')
var fs = require('fs')
var writeFile = require('./write-file')

module.exports = function (spec, callback) {
  spec = schema.validate(spec)

  spec = spec.options.scanSpecForFiles(spec, false)
  spec.options.files.push(
    '/pages/layout.html'
  )
  var files = spec.options.files.concat(getPagesAndComponents(spec))

  async.each(files, function (file, next) {
    fs.readFile(process.cwd() + '/' + file, function (err, buffer) {
      if (err) {
        return next(err)
      }
      var partPath = spec.options.outputDir + '/' + file
      var outFile = process.cwd() + partPath
      console.log('  copied:', partPath)
      writeFile(outFile, buffer, next)
    })
  }, callback)
}

function getPagesAndComponents (spec) {
  var files = []
  Object.keys(spec).forEach(function (page) {
    var pageName = spec[page].page
    if (pageName) {
      files.push('pages/' + pageName + '/' + pageName + '.html')
      for (var selector in spec[page].spec) {
        var component = spec[page].spec[selector].component
        files.push('components/' + component + '/' + component + '.html')
      }
    }
  })
  return files
}
