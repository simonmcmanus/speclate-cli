var routing = require('./routing')
var path = require('path')

var fetchLists = (listNames) => {
  var out = {}
  listNames.forEach((listName) => {
    var dataPath = path.join(process.cwd(), `/lists/${listName}.json`)
    out[listName] = require(dataPath)
  })
  return out
}


const transform = (item) => {
  item['.summary'] = item.markup
  item['.title'] = item.title
  return item;
}
module.exports = (spec) => {
  for (var route in spec) {
    const listNames = spec[route].lists
    const isDynamicRoute = listNames && listNames.length > 0

    if (isDynamicRoute) {
      const lists = fetchLists(listNames)
      listNames.forEach((listName) => {
        const generatedRoutes = routing.getAllRoutes(route, lists[listName])

        // we could a toggle here to do the lookup for us.
        for (var generatedRoute in generatedRoutes)  {
          spec[generatedRoute] = {
            page: spec[route].page,
            lists: listNames,
            filters: spec[route].filters,
            //spec: generatedRoutes[generatedRoute]
            // this should always be a filter. 
            //spec: transform(generatedRoutes[generatedRoute][0])
          }
        }
      })
      delete spec[route] // dynamic route generated, remove original
    }
  }
  return spec
}
