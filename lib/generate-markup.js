'use strict'

/**
 * Generates a static site.
 */
var async = require('async')
var validator = require('./validators')
var writeFile = require('./write-file')
var chalk = require('chalk')

module.exports = function (spec, speclate, callback) {

  speclate.site(spec, function (error, files) {
    if (error) {
      return callback(error)
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
              return next(err)
            } else if (spec.options.validate.w3c === 'warn') {
              console.log('w3c Validation error: ' + err)
            }
          }

          console.log(chalk.grey('  writing: ', spec.options.outputDir + item.name))
          writeFile(filePath, item.markup, next)
        })
      } else {
        console.log(chalk.grey('  writing: ', spec.options.outputDir + item.name))
        writeFile(filePath, item.markup, next)
      }
    }, function (err, data) {
      console.log(chalk.green('  ok'))
      callback(err, data)
    })
  })
}
