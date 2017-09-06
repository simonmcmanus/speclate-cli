var chalk = require('chalk')
var _ = require('lodash')

module.exports = (spec) => {
  for (var route in spec) {
    const isDynamicRoute = (spec[route].data && spec[route].group && spec[route].url)
    if (isDynamicRoute) {
      const dynamicRoutes = spec[route].data.reduce(spec[route].group, {})

      for (var group in dynamicRoutes) {
        const generatedUrl = spec[route].url(group)
        const generatedRoutes = generateRoute(spec[route], dynamicRoutes[group], group)
        spec[generatedUrl] = generatedRoutes
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
      newObj[item] = value[item].replace(re, newValue)
    }
    return newObj
  }
};
