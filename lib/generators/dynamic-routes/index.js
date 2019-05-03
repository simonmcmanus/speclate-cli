var chalk = require('chalk')
var _ = require('lodash')

var getAllRoutes  = require('./routing').getAllRoutes

module.exports = (spec) => {

  for (var route in spec) {
    const isDynamicRoute = (spec[route].list)
    if (isDynamicRoute) {

      // GET UNIQUE URLS 

      const allRoutes = getAllRoutes(route, spec[route].list)

      allRoutes.forEach((generatedRoute) => {

        if(spec[route].data instanceof 'List') {
          spec[route].data.get()

        }
      })
      console.log('-->', Object.keys(allRoutes))
      // FOREACH URL - DO THE FILTER.

      var generatedRoutes = {};
      // for each item in the list, work out which urls it could belong to on the route. 
      spec[route].data.forEach(function(item) {





        // const itemsByUrl = keyDataByUrl(route, item)


   

        // _.merge(generatedRoutes, itemsByUrl)

        // if(item.date === '2007-10-10') {

        //   console.log('====================>')
        //   console.log('d=', itemsByUrl)
        //   console.log('generated', generatedRoutes)
        //   console.log('====================>')

        // }



      })


      for (var generatedRoute in generatedRoutes) {
        spec[generatedRoute] = {
          page: spec[route].page,
          spec: generateSpec(spec[route].spec, generatedRoutes[generatedRoute])
        }
      }
      // remove the original dynamic route -  as generation is now complete.
      delete spec[route];
    }
  }
  return spec
}

var generateSpec = (pageSpec, data) => {
  let generatedSpec = {}
  for (var selector in pageSpec) {
    if (pageSpec[selector].component && !pageSpec[selector].data) {
      generatedSpec[selector] = {
        component: pageSpec[selector].component
      }
      generatedSpec[selector].data = data
    } else {
      if (pageSpec[selector].content) {
        if (!generatedSpec[selector]) {
          generatedSpec[selector] = {}
        }
      }
      generatedSpec[selector] = pageSpec[selector];
    }
  }
  return generatedSpec
}
