'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var writeFile = require('./write-file')
var path = require('path')

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
      var partPath = path.join(spec.options.outputDir, '/api/speclate' + item.name.slice(0, -4) + 'json')
      var filePath = path.join(process.cwd(), partPath)

      writeFile(filePath, JSON.stringify(compiledSpec, null, 4), next)

      console.log('  written: ', partPath)
    }, callback)
  })
}
