var _ = require('lodash')

/**
 * takes a look at the spec and works out what files are needed.
 */
module.exports = function (siteSpec) {

  delete siteSpec.options;
  var byPage = {};
  var allFiles = {} // combineds per page.
  for (var page in siteSpec) {
    const pageFiles = extractPage(siteSpec[page])
    byPage[page] = pageFiles
    allFiles = addPageToAll(pageFiles, allFiles) 
  }
  return {
    allFiles,
    byPage
  }
}

// takes page files and adds them to allFiles and ensures the values in allFiles are still unique.
const addPageToAll = (pageFiles, allFiles) => {
  allFiles.pages = _.union(allFiles.pages, pageFiles.pages)
  allFiles.components = _.union(allFiles.components, pageFiles.components)
  allFiles.lists = _.union(allFiles.lists, pageFiles.lists)
  allFiles.filters = _.union(allFiles.filters, pageFiles.filters)
  allFiles.mappers = _.union(allFiles.mappers, pageFiles.mappers)
  return allFiles
}

// extracts a list of all the files needed to render the page. 
// this will be used to build the page but also to load them into the client. 
var extractPage = function (page) {
  // does this need to look at the detualt spec?
  const out = {
    pages: [page.page],
    components: [],
    lists: page.lists || [],
    filters: page.filters || [],
    mappers: page.mapper ? [page.mapper] : []
  }

  for (var selector in page.spec) {

    if (page.spec[selector].component) {
      out.components.push(page.spec[selector].component)
      out.lists = out.lists.concat(page.spec[selector].lists)
      out.filters = out.filters.concat(page.spec[selector].filters)
      var states = page.spec[selector].states
      for (var state in states) {
        out.components.push(states[state].component)
        if (states[state].mapper) {
          out.mappers.push(states[state].mapper)
        }
      }
    }
  }
  var deduped = {}
  for (var item in out) {
    deduped[item] = [...new Set(out[item])]
  }
  return deduped
}
