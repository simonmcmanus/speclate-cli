var routing = require('./routing')

module.exports = (spec, lists) => {
  for (var route in spec) {
    const listNames = spec[route].lists
    const isDynamicRoute = listNames && listNames.length > 0
    if (isDynamicRoute) {
      listNames.forEach((listName) => {
        const generatedRoutes = routing.getAllRoutes(route, lists.lists[listName])
        // we could a toggle here to do the lookup for us.
        for (var generatedRoute in generatedRoutes)  {
          spec[generatedRoute] = {
            page: spec[route].page,
            lists: spec[route].lists,
            filters: spec[route].filters,
            mapper: spec[route].mapper,
            spec: spec[route].spec // need to do something about the [0] - hack toget round needing an object
          }
        }
      })
      delete spec[route] // dynamic route generated, remove original
    }
  }
  return spec
}
