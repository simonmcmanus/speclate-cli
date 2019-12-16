'use strict'

const fs = require('fs')
const path = require('path')
var log = require('./log')
var async = require('async')

const getLists = function (spec) {
  const lists = []
  for (var route in spec) {

    if (spec[route].lists) {
      spec[route].lists.forEach((list) => {
        lists.push(list)
      })
    }
  }
  return lists
}

module.exports = function (spec, callback) {
  const lists = getLists(spec)
  const out = {}

  async.each(lists, function (list, next) {
    var source = path.join(process.cwd(), '/lists', list + '.json')
    var destination = path.join(process.cwd(), './docs/lists/' + list + '.json')
    var required = require(source)
    // todo - dedupe here
    out[list] = required
    fs.writeFile(destination, JSON.stringify(required), () => {
      log.debug(`writen ${destination}`)
      next()
    })
  }, () => {
    callback(null, out)
  })
}
