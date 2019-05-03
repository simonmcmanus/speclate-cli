'use strict'

const fs = require('fs')
const path = require('path')
var chalk = require('chalk')
var writeFile = require('./move-file')

var async = require('async')

const getLists = function (spec) {
  const lists = []
  for (var route in spec) {
    if (spec[route].list) {
      lists.push(spec[route].list)
    }
  }
  return lists
}

module.exports = function (spec, callback) {
  const lists = getLists(spec)

  async.each(lists, function (list, next) {
    var source = path.join(process.cwd(), '/lists', list + '.js')

    var destination = path.join(process.cwd(), '/lists/out-', list + '.js')
    var required = require(source)
    console.log('r', required)

    const listJs = generateClientList(list, required)
    writeFile(destination, listJs, (err) => {
      if (err) throw err
      console.log(chalk.grey('  writing: ', destination))
      callback()
    })
  }, callback)
}
