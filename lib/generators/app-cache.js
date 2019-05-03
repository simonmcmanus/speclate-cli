'use strict'
var async = require('async')
var moveFile = require('../move-file')
var log = require('../log')

/**
 * Generates an app cache file based on the spec provided.
 */

var fs = require('fs')
var path = require('path')
var files = [
  'CACHE MANIFEST'
]

module.exports = function (spec, options, callback) {
  files = files.concat(sortFiles(spec, options))
  files.push('# v-' + +new Date())
  files.push('NETWORK:', '*')

  var partPath = path.join(process.cwd(), options.outputDir, '/manifest.appcache')

  async.forEach(options.appCacheFiles, function (file, next) {
    moveFile(file, spec.options, function () {
      log.debug(`Moved file ${file}`)
      next()
    })
  })
  log.debug(`written ${partPath}`)
  log.success('ok')
  fs.writeFile(partPath, files.join('\n'), callback)
}

var sortFiles = function (spec, options) {
  var files = ['/', '/pages/layout.html'].concat(options.files, options.appCacheFiles)

  Object.keys(spec).forEach(function (page) {
    // no de-duping going on - same page/component could be listed twice.

    var pageName = spec[page].page
    var routeName
    if (page === '/') {
      routeName = 'index'
    } else {
      routeName = page.slice(0, -5)
    }
    files.push(page)
    files.push('/pages/' + pageName + '/' + pageName + '.html')

    files.push('/' + routeName + '.json')
    for (var selector in spec[page].spec) {
      var component = spec[page].spec[selector].component
      if (component) {
        files.push('/components/' + component + '/' + component + '.html')
      }
    }
  })

  return files
}
