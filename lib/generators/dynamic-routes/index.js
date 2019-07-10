var chalk = require('chalk')
var _ = require('lodash')
var routing = require('./routing')

var getAllRoutes = routing.getAllRoutes

module.exports = (spec) => {
  for (var route in spec) {
    const isDynamicRoute = (spec[route].list)
    if (isDynamicRoute) {
      // GET UNIQUE URLS

      const allRoutes = getAllRoutes(route, spec[route].list)

      allRoutes.forEach((generatedRoute) => {
        if (spec[route].data instanceof 'List') {
          spec[route].data.get()
        }
      })

      var generatedRoutes = {}
      // for each item in the list, work out which urls it could belong to on the route.
      spec[route].data.forEach(function (item) {
        const itemsByUrl = routing.keyDataByUrl(route, item)
        _.merge(generatedRoutes, itemsByUrl)
      })

      for (var generatedRoute in generatedRoutes) {
        spec[generatedRoute] = spec[route]
      }
      // remove the original dynamic route -  as generation is now complete.
      delete spec[route]
    }
  }
  return spec
}
