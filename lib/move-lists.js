'use strict'

const path = require('path')
var async = require('async')
var writeFile = require('./write-file')

const getLists = function (spec) {
  return {
    lists: ['links', 'posts', 'categories'], // todo - lookup
    filters: ['byTitleSlug', 'mostRecent', 'byTags', 'byDate'],
    mappers: ['posts', 'post', 'links', 'category']
  }
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

module.exports = function (spec, callback) {
  const { lists, filters, mappers } = getLists(spec)

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
