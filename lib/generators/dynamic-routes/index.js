var routing = require('./routing')
var _ = require('lodash')

module.exports = (spec, lists) => {
  for (var route in spec) {
    const listNames = spec[route].lists
    const isDynamicRoute = listNames && listNames.length > 0
    if (isDynamicRoute) {
      listNames.forEach(function (listName) {
        const generatedRoutes = routing.getAllRoutes(route, lists.lists[listName])
        // we could a toggle here to do the lookup for us.
        for (var generatedRoute in generatedRoutes) {
          var params = generatedRoutes[generatedRoute].params
          var pageSpec = checkSpecForReplace(_.clone(spec[route].spec), params)
          spec[generatedRoute] = {
            params: params,
            page: spec[route].page,
            lists: spec[route].lists,
            filters: spec[route].filters,
            mapper: spec[route].mapper,
            spec: pageSpec
          }
        }
      })

      delete spec[route] // dynamic route generated, remove original
    }
  }
  return spec
}

var checkSpecForReplace = function (spec, params) {
  for (var selector in spec) {
    for (var key in params) {
      spec[selector] = checkForReplace(spec[selector], ':' + key, params[key])
    }
  }
  return spec
}

var checkForReplace = (value, key, newValue) => {
  var re = new RegExp(key, 'g')
  if (typeof value === 'string') {
    return value.replace(re, newValue)
  } else {
    var newObj = _.clone(value)
    for (var item in newObj) {
      if (value[item].replace) {
        newObj[item] = value[item].replace(re, newValue)
      }
    }
    return newObj
  }
}
