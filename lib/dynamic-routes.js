var chalk = require('chalk')

module.exports = (spec) => {

  Object.keys(spec).forEach((route) => {

    //console.log('->', route)

    const isDynamicRoute = (spec[route].data && spec[route].group);

    if (isDynamicRoute) {
      const dynamicRoutes = spec[route].data.reduce(spec[route].group, {})

      Object.keys(dynamicRoutes).forEach((group) => {
        //encode url
        // use page.js to generate the url?

        const generatedUrl = '/links/' + group.replace(/ /g, '-') + '/index.html'

        console.log(chalk.grey('generating: ' + generatedUrl))
        spec[generatedUrl] = {
          page: spec[route].page,
          spec: spec[route].spec
        }

        Object.keys(spec[generatedUrl].spec).forEach((selector) => {

          const item = spec[route].spec[selector];
          // if component specified but no data
          if (item.component && !item.data) {
            spec[route].spec[selector].data = dynamicRoutes[group]
          }
        })
      })

      delete spec[route]
    }
  })

  //console.log('DYNO ROUTES', JSON.stringify(spec, null, 4));
  return spec
}

