var path = require('path')
var fs = require('fs')

module.exports = async function (files) {

  return {
    pages: await loadList(files.pages, './pages/', 'html', true),
    components: await loadList(files.components, './components/', 'html', true),
    lists: {
      filters: await loadList(files.filters, './lists/filters', 'js', false),
      mappers: await loadList(files.mappers, './lists/mappers', 'js', false),
      lists: await loadList(files.lists, './lists/', 'json', false)
    }
  }
}

const loadList = async function (list, folderPath, ext, doublePath) {
  var promises = list.map(async (file) => {
    var filePath = doublePath ? `${file}/` : ''
    var source = path.join(process.cwd(), folderPath, filePath, `${file}.${ext}`)

    if (ext === 'js' || ext === 'json') {
      
      return new Promise(function (resolve, reject) {
        var js = require(source)
        resolve(js)
      })
    } 
    return fs.readFileSync(source, 'utf8')
  })
  const files = await Promise.all(promises)
  const keyedByFile = files.reduce(function (acc, fileContent, index) {
    acc[list[index]] = fileContent
    return acc
  }, {})
  return keyedByFile
}
