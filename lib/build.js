var fs = require('fs')
var async = require('async')

var schema = require('speclate-schema')

var generateMarkup = require('./generators/markup')
var generateApi = require('./generators/api')
var generateImages = require('./generators/images')
var layout = require('./generators/layout')
var appCache = require('./generators/app-cache')
var dynamicRoutes = require('./generators/dynamic-routes')
var offlineSpec = require('./generators/offline-spec')

var generateCss = require('./preprocessors/scss-global')
var Sitemap = require('./sitemap')
var moveFiles = require('./move-files')

var moveLists = require('./move-lists')

var combineSpecs = require('./combine')
var extract = require('./extract')
var loadFiles = require('./load-files')
var log = require('./log')
var debugLog = []
module.exports = (spec, speclate, callback) => {
  let validSpec
  let completeSpec
  let requiredFileNames
  var files 

  var methods = [
    next => {
      log.info('Validating spec')
      validSpec = schema.validate(spec)
      log.success('ok')
      next()
    },
    next => {
      log.info('Combine specs')
      completeSpec = combineSpecs(validSpec, speclate, next)
      log.success('ok')
      next()
    },

    next => {
      log.info('Spec Analysis')

      // extracts all the filenames required to build the site. 
      requiredFileNames = extract(completeSpec)
      debugLog.push({
        name: 'Required File Names', 
        data: requiredFileNames
      })
      log.success('ok')
      
      next()
    },
    next => {
      log.info('Generate Build Log')
      var filePath = process.cwd() + '/docs/speclate-log.json'
      fs.writeFile(filePath, JSON.stringify(debugLog, null, 4), () => {
        console.log('written ' + filePath)
        next()
      })
    },

    async (next) => {
      log.info('Load Files')
      // loads the files into memory so they can be used in the build and written to the client later.
      files = await loadFiles(requiredFileNames.allFiles)
      debugLog.push({
        name: 'Required Files', 
        data: files
      })
      log.success('ok')
    },

    next => {
      log.info('Generating dynamic routes from spec')
      validSpec = dynamicRoutes(spec, files.lists)
      log.success('ok')
      next()
    },

    next => {
      log.info('Generating markup')
      generateMarkup(validSpec, speclate, files, next)
    },
    next => {
      log.info('Creating layout')
      layout(validSpec, speclate, next)
    },
    next => {
      log.info('Generating API')
      generateApi(validSpec, speclate, files, next)
    },
    next => {
      log.info('Generating Sitemap')
      Sitemap(validSpec, speclate, next)
    },
    next => {
      if (
        validSpec.options.build &&
        validSpec.options.build.css === 'scss-global'
      ) {
        // only curently supports scss global but its easy to add others, this could also take a func
        log.info('Generating CSS')
        return generateCss(validSpec, speclate, next)
      }
    },

    // next => {
    //   log.info('Generating Images')
    //   generateImages(completeSpec, speclate, next)
    //   log.success('ok')
    // },
    // next => {
    //         // 
    //         log.info('Write client side js files')
    //         // needs to fetch the filters in here
    //         // should we just copy over the whole folder?
    //         moveLists(completeSpec, files, function (err, fetchedLists) {
    //           if (err) {
    //             throw err
    //           }
    //           log.success('ok')
    //           next()
    //         })
    //       },
      
    next => {
      log.info('Generating Manifest file')
      appCache(validSpec, speclate, next)
    },
    next => {
      log.info('Moving files')
      moveFiles(validSpec, next)
    },
    next => {
      log.success('--- Site Built ---')
    }
  ]
  async.series(methods, callback)
}
