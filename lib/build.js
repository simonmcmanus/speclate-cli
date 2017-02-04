var async = require('async')

var schema = require('speclate-schema')
var generateMarkup = require('./generate-markup')
var generateApi = require('./generate-api')
var appCache = require('./app-cache')
var moveFiles = require('./move-files')


module.exports = (spec, callback) => {

  var methods = [
    (next) => {
      console.log('')
      console.log('Validating spec..')
      schema.validate(spec)
      console.log('  ok')
      next()
    },
    (next) => {
      console.log('')
      console.log('Generating markup..')
      generateMarkup(spec, next)
    },
    (next) => {
      console.log('')
      console.log('Generating API..')
      generateApi(spec, next)
    },
    (next) => {
      console.log('')
      console.log('Generating Manifest file..')
      appCache(spec, next)
    },
    (next) => {
      console.log('')
      console.log('Moving files..')
      moveFiles(spec, next)
    }
  ]
  async.series(methods, callback)
}