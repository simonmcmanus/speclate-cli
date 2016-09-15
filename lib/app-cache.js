'use strict'

/**
 * Generates an app cache file based on the spec provided.
 */

var fs = require('fs')
var sortFiles = require('sort-files')
var files = [
  'CACHE MANIFEST'
]

module.exports = function (spec, callback) {

  files = files.concat(sortFiles(spec))
  files.push('# v-' + +new Date())
  files.push('NETWORK:', '*')
  fs.writeFile(process.cwd() + '/manifest.appcache', files.join('\n'))
  callback()
}


sortFiles = function (spec) {

  var files = [ '/pages/layout.html', '/']

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
