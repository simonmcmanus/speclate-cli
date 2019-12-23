var async = require('async')

var schema = require('speclate-schema')

var generateMarkup = require('./generators/markup')
var generateApi = require('./generators/api')
var generateImages = require('./generators/images')
var layout = require('./generators/layout')
var appCache = require('./generators/app-cache')
var dynamicRoutes = require('./generators/dynamic-routes')

var generateCss = require('./preprocessors/scss-global')
var Sitemap = require('./sitemap')
var moveFiles = require('./move-files')

var moveLists = require('./move-lists')

var combineSpecs = require('./combine')
var log = require('./log')

module.exports = (spec, speclate, callback) => {
  let validSpec
  let completeSpec
  let lists

  var methods = [
    (next) => {
      log.info('Validating spec')
      validSpec = schema.validate(spec)
      log.success('ok')
      next()
    },
    (next) => {
      log.info('Combine specs')
      completeSpec = combineSpecs(validSpec, speclate, next)
      log.success('ok')
      next()
    },
    (next) => {
      log.info('Moving lists')
      // needs to fetch the filters in here
      // should we just copy over the whole folder?
      moveLists(completeSpec, function (err, fetchedLists) {
        if (err) {
          throw err
        }
        log.success('ok')
        lists = fetchedLists
        next()
      })
    },
    (next) => {
      log.info('Generating dynamic routes from spec')
      validSpec = dynamicRoutes(spec)
      log.success('ok')
      next()
    },
    (next) => {
      log.info('Generating Images')
      generateImages(completeSpec, speclate, next)
      log.success('ok')
    },
    (next) => {
      log.info('Generating markup')
      generateMarkup(validSpec, speclate, lists, next)
    },
    (next) => {
      log.info('Creating layout')
      layout(validSpec, speclate, next)
    },
    (next) => {
      log.info('Generating API')
      generateApi(validSpec, speclate, lists, next)
    },
    (next) => {
      log.info('Generating Sitemap')
      Sitemap(validSpec, speclate, next)
    },
    (next) => {
      if (validSpec.options.build && validSpec.options.build.css === 'scss-global') {
        // only curently supports scss global but its easy to add others, this could also take a func
        log.info('Generating CSS')
        return generateCss(validSpec, speclate, next)
      }
    },
    (next) => {
      log.info('Generating Manifest file')
      appCache(validSpec, speclate, next)
    },
    (next) => {
      log.info('Moving files')
      moveFiles(validSpec, next)
    },
    (next) => {
      log.success('--- Site Built ---')
    }
  ]
  async.series(methods, callback)
}
