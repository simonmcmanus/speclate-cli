'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var siteLoader = require('speclate/lib/site/loader')
var validator = require('./validators')

var writeFile = require('fs').writeFile

module.exports = function (spec, callback) {
  siteLoader(spec, function (error, files) {
    if (error) {
      throw error
    }
    async.each(files, function (item, next) {
      if (item.name === '/') {
        item.name = '/index.html'
      }
      var filePath = process.cwd() + '' + spec.options.outputDir + item.name

      validator(item, function (err) {

        if (err) {
          throw err;
        }

        console.log('  written: ', spec.options.outputDir + item.name)
        writeFile(filePath, item.markup, next)


      });


    }, callback)
  })
}
