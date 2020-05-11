
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
var writeFile = require('./write-file')

var moveLists = require('./move-lists')

var combineSpecs = require('./combine')
var extract = require('./extract')
var loadFiles = require('./load-files')
var log = require('./log')
const clonedeep = require('lodash').cloneDeep

module.exports = (spec, options, speclate, callback) => {
  let combinedSpec
  let completeSpec
  let requiredFileNames

  var files

  let originalSpec

  var methods = [
    next => {
      log.info('Combine specs')
      // this should do something with the default spec, no?
      // supports components spec for images
      combinedSpec = combineSpecs(spec, speclate, next)
      log.success('ok')
      next()
    },

    next => {
      log.info('Spec Analysis')
      // extracts all the filenames required to build the site.
      requiredFileNames = extract(combinedSpec, speclate)
      log.success('ok')
      next()
    },

    async (next) => {
      log.info('Load Files')
      // loads the files into memory so they can be used in the build and written to the client later.
      files = await loadFiles(requiredFileNames.allFiles)
      log.success('ok')
    },

    next => {
      log.info('Write ./speclate-required.js')
      var folder = process.cwd() + '/client'
      var fileName = folder + '/speclate-required.js'
      log.debug('writing' + fileName)
      const content = 'export default ' + JSON.stringify(requiredFileNames.allFiles, null, 4)
      writeFile(fileName, content, (err) => {
        if (!err) {
          log.success('ok')
        }
        next()
      })
    },
    next => {
      log.info('Generate dynamic routes from spec')
      completeSpec = dynamicRoutes(spec, files.lists)
      originalSpec = clonedeep(completeSpec)
      log.success('ok')
      next()
    },

    next => {
      log.info('Generate markup')
      generateMarkup(completeSpec, options, speclate, files, (err, files) => {
        if (err) {
          throw err
        }
        next()
      })
    },
    next => {
      log.info('Create layout')
      layout(completeSpec, speclate, (err) => {
        if (!err) {
          log.success('ok')
        }
        next()
      })
    },
    next => {
      log.info('Generate API')
      // lots of duplication happening here, we should cache the result from building the site and just generate the api from that.
      generateApi(originalSpec, speclate, files, next)
    },
    next => {
      log.info('Generate Sitemap')
      Sitemap(completeSpec, options, next)
    },
    next => {
      if (
        options.build &&
        options.build.css === 'scss-global'
      ) {
        // only curently supports scss global but its easy to add others, this could also take a func
        log.info('Generate CSS')
        return generateCss(completeSpec, speclate, next)
      } else {
        next()
      }
    },

    next => {
      log.info('Generating Images')
      generateImages(completeSpec, speclate, next)
      log.success('ok')
    },
    next => {
      //
      log.info('Write files')
      // needs to fetch the filters in here
      // should we just copy over the whole folder?
      moveLists(completeSpec, files, function (err, fetchedLists) {
        if (err) {
          throw err
        }
        log.success('ok')
        next()
      })
    },

    next => {
      log.info('Generate Manifest file')
      appCache(completeSpec, options, next)
    },
    next => {
      log.info('Moving files')
      // takes options.files, and looks in scanSpecForFiles and moves them into the docs directory.
      moveFiles(completeSpec, options, next)
    },
    next => {
      log.success('--- Site Built ---')
    }
  ]
  async.series(methods, callback)
}
