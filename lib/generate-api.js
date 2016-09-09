'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var pageLoader = require('../../speclate/lib/site/loader')
var writeFile = require('./write-file')
var path = require('path')

module.exports = function (spec, callback) {

  pageLoader(spec, function (error, files) {
    if (error) {
      throw error()
    }
    async.each(files, function (item, next) {

        var compiledSpec = spec[item.name];

        var filePath = path.join(process.cwd(), spec.options.outputDir, '/api/speclate' + item.name.slice(0, -4) + 'json')

      console.log('writing json file ', filePath)
      writeFile(filePath, JSON.stringify(compiledSpec, null, 4), next)
    }, callback)
  })
}