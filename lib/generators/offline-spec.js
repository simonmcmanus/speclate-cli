'use strict'

/**
 * Generates a static site.
 */
var writeFile = require('../write-file')
var chalk = require('chalk')
var path = require('path')

module.exports = function (spec, speclate, callback) {
  var sortedFiles = sortFiles(spec)
  var offlineSpecPath = path.join(process.cwd(), '/client/offline-spec.json')
  console.log(chalk.grey('  writing: ', offlineSpecPath))
  writeFile(offlineSpecPath, JSON.stringify(sortedFiles, null, 4), callback)
}

const sortFiles = function (spec) {
  var layout = [ '/pages/layout.html' ]
  var components = []
  var pages = []
  var routes = ['/']
  var specs = []

  Object.keys(spec).forEach(function (page) {
    // no de-duping going on - same page/component could be listed twice.

    if (page === 'options' || page === 'defaultSpec') {
      return
    }
    var pageName = spec[page].page
    var routeName
    if (page === '/') {
      routeName = 'index'
    } else {
      routeName = page.slice(0, -5)
    }
    routes.push(page)

    if (pageName) {
      pages.push(pageName + '/' + pageName + '.html')
    }

    specs.push(routeName + '.json')

    components = components.concat(getComponents(spec[page].spec))
  })
  if (spec.defaultSpec) {
    components = components.concat(getComponents(spec.defaultSpec))
  }

  const dedupe = function (names) {
    return names.filter((value, index) => names.indexOf(value) === index)
  }
  return {
    components: dedupe(components),
    pages: dedupe(pages),
    routes: routes,
    specs: specs,
    layout: layout,
    extras: spec.options.files
  }
}

function getComponents (spec) {
  var components = []
  for (var selector in spec) {
    var component = spec[selector].component
    if (component) {
      components.push(component + '/' + component + '.html')
    }
  }
  return components
}
