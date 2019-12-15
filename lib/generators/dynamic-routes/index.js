var chalk = require('chalk')
var _ = require('lodash')
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

        for (var generatedRoute in generatedRoutes)  {
         spec[generatedRoute] = {
            page: spec[route].page,
            spec: transform(generatedRoutes[generatedRoute][0])
          }
        }
      })

      // remove the original dynamic route -  as generation is now complete.
      delete spec[route]
    }
  }
  return spec
}
