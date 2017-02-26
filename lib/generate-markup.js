'use strict'

/**
 * Generates a static site.
 */
var async = require('async')

var validator = require('./validators')

var writeFile = require('fs').writeFile

module.exports = function (spec, speclate, callback) {

  console.log(speclate);
  speclate.site(spec, function (error, files) {
    if (error) {
      throw error
    }
    async.each(files, function (item, next) {
      if (item.name === '/') {
        item.name = '/index.html'
      }
      var filePath = process.cwd() + '' + spec.options.outputDir + item.name

      if (spec.options.validate && spec.options.validate.w3c) {
        validator(item, function (err) {
          if (err) {
            if (spec.options.validate.w3c === 'error') {
              console.log(err)
              return next(err)
            } else if (spec.options.validate.w3c === 'warn') {
              console.log('w3c Validation error: ', err)
            }
          }

          console.log('  written: ', spec.options.outputDir + item.name)
          writeFile(filePath, item.markup, next)
        })
      } else {
        console.log('  written: ', spec.options.outputDir + item.name)
        writeFile(filePath, item.markup, next)
      }


    }, callback)
  })
}
