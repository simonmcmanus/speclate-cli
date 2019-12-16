var UrlAssembler = require('url-assembler')
var _ = require('lodash')

const doReplace = function (route, key, value) {
  return route.replace(key, '/' + encodeURIComponent(value) + '/')
}

// we only need to do the replace if the route contains the key.
const replaceNeeded = function (route, key) {
  return route.indexOf(key) > -1
}

const addUrl = function (urls, url, item) {
  if (!urls[url]) {
    urls[url] = [item]
  } else {
    urls[url].push(item)
  }
  return urls
}
/**
 * Given a route and some params, generate all the urls the data item could live under, given the provided route.
 * @param {String} route
 * @param {object} params
 */
exports.keyDataByUrl = function (route, params) {
  var urls = {}
  Object.keys(params).forEach(function (param) {
    var key = '/:' + param + '/'

    if (replaceNeeded(route, key)) {
      var value = params[param]

      if (Array.isArray(value)) {
        value.forEach(function (item) {
          var url = doReplace(route, key, item) 
          urls = addUrl(urls, url, item)
        })
      } else {
        var url = doReplace(route, key, value)
        urls = addUrl(urls, url, params)
      }
    }
  })
  return urls
}

//  given a list, generate all the possible urls.
exports.getAllRoutes = function (route, data) {
  const urls = {}
  data.forEach((item) => {
    _.merge(urls, exports.keyDataByUrl(route, item))
  })

  return urls
}
