'use strict'

const path = require('path')
var async = require('async')
var writeFile = require('./write-file')

var writeJs = function (name, folderPath, type, content, next) {
  var value

  if (typeof content === 'function') {
    value = content.toString()
  } else {
    value = JSON.stringify(content, null, 4)
  }
  const setupVars = `
  export default ${value}`
  var destination = path.join(process.cwd(), `/docs/lists/${folderPath}/${name}.js`)
  writeFile(destination, setupVars, next)
}

var writeHTML = function (name, type, content, next) {
  var destination = path.join(process.cwd(), `/docs/${type}/${name}/${name}.html`)
  writeFile(destination, content, next)
}

module.exports = function (spec, files, callback) {
  const { lists, filters, mappers } = files.lists
  const { components, pages } = files

  async.parallel({

    components: function (next) {
      async.forEachOf(components, (component, componentName, nextComponent) => {
        writeHTML(componentName, 'components', component, nextComponent)
      }, next)
    },
    pages: function (next) {
      async.forEachOf(pages, (page, pageName, nextPage) => {
        writeHTML(pageName, 'pages', page, nextPage)
      }, next)
    },
    filters: function (next) {
      async.forEachOf(filters, (filter, filterName, nextFilter) => {
        writeJs(filterName, 'filters/', 'filters', filter, nextFilter)
      }, next)
    },

    lists: function (next) {
      async.forEachOf(lists, (list, listName, nextList) => {
        writeJs(listName, '/', 'lists', list, nextList)
      }, next)
    },
    mappers: function (next) {
      async.forEachOf(mappers, (mapper, mapperName, nextMapper) => {
        writeJs(mapperName, 'mappers/', 'mappers', mapper, nextMapper)
      }, next)
    }
  }, callback)
}
