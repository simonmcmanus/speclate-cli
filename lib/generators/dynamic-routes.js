var chalk = require('chalk')
var _ = require('lodash')

module.exports = (spec) => {
  for (var route in spec) {
    const isDynamicRoute = (spec[route].data)
    if (isDynamicRoute) {

      let dynamicRoutes
      let grouped
      if (spec[route].group) {
        dynamicRoutes = spec[route].data.reduce(spec[route].group, {})
        grouped = true;
      } else {
        grouped = false;
        dynamicRoutes = spec[route].data.reduce((pages, item) => {
          pages[item.url] = item
          return pages
        }, {})
      }

      for (var group in dynamicRoutes) {

        let generatedUrl

        if (typeof spec[route].url === 'function') {
          generatedUrl = spec[route].url(group)
        }

        if (typeof dynamicRoutes[group].url === 'string') {
          generatedUrl = dynamicRoutes[group].url
        }

        if (grouped) {
          const generatedRoutes = generateRoute(spec[route], dynamicRoutes[group], group)
          spec[generatedUrl] = generatedRoutes
        } else {
          spec[generatedUrl] = {
            page: spec[route].page,
            spec: dynamicRoutes[group]
          }
        }
      }
      delete spec[route]
    }
  }
  return spec
}

var generateRoute = (pageSpec, data, group) => {
  let generatedSpec = {}
  for (var selector in pageSpec.spec) {
    if (pageSpec.spec[selector].component && !pageSpec.spec[selector].data) {
      generatedSpec[selector] = {
        component: pageSpec.spec[selector].component
      }
      generatedSpec[selector].data = data
    } else {
      if (pageSpec.spec[selector].content) {
        if (!generatedSpec[selector]) {
          generatedSpec[selector] = {}
        }
      }

      generatedSpec[selector] = checkForReplace(pageSpec.spec[selector], ':group', group)
    }
  }
  return {
    page: pageSpec.page,
    spec: generatedSpec
  }
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
