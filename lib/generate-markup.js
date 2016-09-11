'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var writeFile = require('fs').writeFile

module.exports = function (spec, speclate, callback) {
  speclate.site.loader(spec, function (error, files) {
    if (error) {
      throw error
    }
    async.each(files, function (item, next) {
      if (item.name === '/') {
        item.name = '/index.html'
      }
      var filePath = process.cwd() + '' + spec.options.outputDir + item.name
      console.log('  writen: ', spec.options.outputDir + item.name)

      writeFile(filePath, item.markup, next)
    }, callback)
  })
}
