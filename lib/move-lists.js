'use strict'

const fs = require('fs')
const path = require('path')
var log = require('./log')
var async = require('async')

const getLists = function (spec) {
  const namesToFetch = {
    lists: [],
    filters: []
  }
  for (var route in spec) {

    if (spec[route].filters) {
      spec[route].filters.forEach((list) => {
        namesToFetch.filters.push(list)
      })
    }
    if (spec[route].lists) { 
      spec[route].lists.forEach((list) => {
        namesToFetch.lists.push(list)
      })
    }
  }
  return namesToFetch
}

module.exports = function (spec, callback) {
  const { lists, filters } = getLists(spec)
  const out = {
    lists: [], filters: []
  }

  async.each(filters, (filterName, next) => {
    var source = path.join(process.cwd(), '/lists/filters/', filterName + '.js')
    out.filters[filterName] = require(source)
    next()
  }, () => {
    async.each(lists, function (list, next) {
      var source = path.join(process.cwd(), '/lists', list + '.json')
      var destination = path.join(process.cwd(), './docs/lists/' + list + '.json')
      var required = require(source)
      out.lists[list] = required
      fs.writeFile(destination, JSON.stringify(required), () => {
        log.debug(`writen ${destination}`)
        next()  
      })
    }, () => {
      callback(null, out)
    })
  })
}
