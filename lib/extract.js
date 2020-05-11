var _ = require('lodash')

/**
 * takes a look at the spec and works out what files are needed.
 */
module.exports = function (siteSpec, speclate) {
  var byPage = {}
  var allFiles = {} // combineds per page.
  for (var page in siteSpec) {
    const pageFiles = speclate.extractPageAssets(siteSpec[page])
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
