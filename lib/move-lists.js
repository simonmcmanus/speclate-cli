'use strict'

const path = require('path')
var async = require('async')
var writeFile = require('./write-file')

function uniq(a) {
  return Array.from(new Set(a));
}


const getLists = function (spec) {

  const required = {
    lists: [],
    filters: [],
    mappers: []
  }
  // returns the joined array 
  const addToList = (newItems, originalList) => {
    if (newItems) {
      originalList = originalList.concat(newItems)
    }
  }
  const routeCheck = function (route) {

    addToList(route.lists, required.lists)
    addToList(route.filters, required.filters)
    addToList(route.mappers, [required.mapper])

    const spec = route.spec
    for (var selector in spec) {
      const item = spec[selector]
      
      if (item.lists) {
        required.lists = required.lists.concat(item.lists)
      }
      if (item.filters) {
        required.filters = required.filters.concat(item.filters)
      }
      if (item.mapper) {
        required.mappers = required.mappers.concat(item.mapper)
      }
    }
  }

  for (var route in spec) {
    routeCheck(spec[route])
  }
  required.lists = uniq(required.lists)
  required.filters = uniq(required.filters)
  required.mappers = uniq(required.mappers)
  return required
}

const fetchItems = function (items, folderPath, type, ext, done) {
  async.reduce(items, {}, (memo, filterName, next) => {
    var source = path.join(process.cwd(), `/${folderPath}${type}/${filterName}.${ext}`)
    var destination = path.join(process.cwd(), `/docs/${folderPath}${type}/${filterName}.js`)

    memo[filterName] = require(source)
    var fileContents
    if (ext === 'js') {
      fileContents = memo[filterName].toString()
    } else if (ext === 'json') {
      fileContents = JSON.stringify(memo[filterName], null, 4)
    }

    var setupVars = `
    var speclate = window.speclate || { lists: {} }
    speclate.lists = speclate.lists || {}
    speclate.lists.${type} = speclate.lists.${type} || {}
    speclate.lists.${type}.${filterName} = ${fileContents}`

    writeFile(destination, setupVars, (e, d) => {
      next(null, memo)
    })
  }, done)
}

module.exports = function (spec, files, callback) {
  const required = getLists(spec)
  const { lists, filters, mappers } = files.lists
  var destination = path.join(process.cwd(), `/client/speclate-required-lists.json`)

  writeFile(destination, JSON.stringify(required, null, 4), (e, d) => {
    console.log('written ', destination)
  })


  async.parallel({
    filters: function (next) {
      fetchItems(filters, 'lists/', 'filters', 'js', next)
    },
    lists: function (next) {
      fetchItems(lists, '', 'lists', 'json', next)
    },
    mappers: function (next) {
      fetchItems(mappers, 'lists/', 'mappers', 'js', next)
    }
  }, callback)
}
