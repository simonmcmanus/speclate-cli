var chalk = require('chalk')

module.exports = (spec) => {
  for (var route in spec) {
    const isDynamicRoute = (spec[route].data && spec[route].group && spec[route].url)
    if (isDynamicRoute) {
      const dynamicRoutes = spec[route].data.reduce(spec[route].group, {})

      for (var group in dynamicRoutes) {
        const generatedUrl = spec[route].url(group)
        console.log(chalk.grey('Generating ' + generatedUrl))
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
      generatedSpec[selector] = checkForStringReplace(pageSpec.spec[selector], ':group', group)
    }
  }

  return {
    page: pageSpec.page,
    spec: generatedSpec
  }
}

var checkForStringReplace = (value, key, newValue) => {
  var re = new RegExp(key, 'g')
  return value.replace(re, newValue)
}

