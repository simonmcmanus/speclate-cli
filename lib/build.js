var async = require('async')

var schema = require('speclate-schema')
var generateMarkup = require('./generate-markup')
var generateApi = require('./generate-api')
var generateCss = require('./preprocessors/scss-global')
var appCache = require('./app-cache')
var moveFiles = require('./move-files')

module.exports = (spec, speclate, callback) => {

  let validSpec
  var methods = [
    (next) => {
      console.log('')
      console.log('Validating spec..')
      validSpec = schema.validate(spec)
      console.log('ok', validSpec)
      next()
    },
    (next) => {
      console.log('')
      console.log('Generating markup..')
      generateMarkup(validSpec, speclate, next)
    },
    (next) => {
      console.log('')
      console.log('Generating API..')
      generateApi(validSpec, speclate, next)
    },
    (next) => {
      if (validSpec.options.build.css === 'scss-global') {
        // only curently supports scss global but its easy to add others, this could also take a func
        console.log('')
        console.log('Generating CSS..')
        return generateCss(validSpec, speclate, next)
      }
      next()
    },
    (next) => {
      console.log('')
      console.log('Generating Manifest file..')
      appCache(validSpec, speclate, next)
    },
    (next) => {
      console.log('')
      console.log('Moving files..')
      moveFiles(validSpec, next)
    }
  ]
  async.series(methods, callback)
}
