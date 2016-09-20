'use strict'

/**
 * Generates an app cache file based on the spec provided.
 */

var fs = require('fs')
var path = require('path')
var files = [
  'CACHE MANIFEST'
]

module.exports = function (spec, callback) {

  files = files.concat(sortFiles(spec))
  files.push('# v-' + +new Date())
  files.push('NETWORK:', '*')

  var partPath = path.join(process.cwd(), spec.options.outputDir, '/manifest.appcache')
  console.log('written: ', partPath)
  fs.writeFile(partPath, files.join('\n'), callback)
}


var sortFiles = function (spec) {

  var files = ['/', '/pages/layout.html'].concat(spec.options.files, spec.options.appCacheFiles)


  Object.keys(spec).forEach(function (page) {
    // no de-duping going on - same page/component could be listed twice.

    if (page === 'options') {
      return
    }
    var pageName = spec[page].page
    var routeName
    if (page === '/') {
      routeName = 'index'
    } else {
      routeName = page.slice(0, -5)
    }
    files.push(page)
    files.push('/pages/' + pageName + '/' + pageName + '.html')

    files.push('/api/speclate' + routeName + '.json')
    for (var selector in spec[page].spec) {
      var component = spec[page].spec[selector].component
      files.push('/components/' + component + '/' + component + '.html')
    }
  })

  return files
}
