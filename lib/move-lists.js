'use strict'

const path = require('path')
var async = require('async')

const getLists = function (spec) {
  return {
    lists: ['links', 'posts'], // todo - lookup
    filters: ['byTitleSlug', 'mostRecent', 'byTags', 'byDate'],
    mappers: ['posts', 'links']
  }
}

module.exports = function (spec, callback) {
  const { lists, filters, mappers } = getLists(spec)
  const fetchItems = function (items, folderPath, type, ext, done) {
    async.reduce(items, {}, (memo, filterName, next) => {
      var source = path.join(process.cwd(), `/${folderPath}${type}/${filterName}.${ext}`)
      memo[filterName] = require(source)
      next(null, memo)
    }, done)
  }

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