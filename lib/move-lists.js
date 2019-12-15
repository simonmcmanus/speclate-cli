'use strict'

const fs = require('fs')
const path = require('path')
var chalk = require('chalk')
var writeFile = require('./move-file')

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
  console.log('found lists:', lists)

  async.each(lists, function (list, next) {
    var source = path.join(process.cwd(), '/lists', list + '.json')
    var destination = path.join('./docs/lists/' + list + '.json')
    var required = require(source)
    // todo - dedupe here

    fs.writeFile(destination, JSON.stringify(required), () => {
      console.log(chalk.grey('  writing: ', destination))
      next()
    })
  }, callback)
}
