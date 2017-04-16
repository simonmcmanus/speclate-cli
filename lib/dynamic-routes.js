var chalk = require('chalk')

module.exports = (spec) => {

  for (var route in spec) {
    const isDynamicRoute = (spec[route].data && spec[route].group);
    if (isDynamicRoute) {
      const dynamicRoutes = spec[route].data.reduce(spec[route].group, {})

      for (var group in dynamicRoutes) {
        //encode url
        // use page.js to generate the url?

        const generatedUrl = '/links/' + group.replace(/ /g, '-') + '/index.html'
        console.log(chalk.grey('Generating ' + generatedUrl))
        const generatedRoutes = generateRoute(spec[route], dynamicRoutes[group])
        spec[generatedUrl] = generatedRoutes
      }
      delete spec[route]
    }
  }

  return spec
}

var generateRoute = (pageSpec, data) => {

  let generatedSpec = {}
  for (var selector in pageSpec.spec) {

    if (pageSpec.spec[selector].component && !pageSpec.spec[selector].data) {

      generatedSpec[selector] = {
        component: pageSpec.spec[selector].component
      }
      generatedSpec[selector].data = data
    } else {
      generatedSpec[selector] = pageSpec.spec[selector]
    }
  }

  return {
    page: pageSpec.page,
    spec: generatedSpec
  }
}

