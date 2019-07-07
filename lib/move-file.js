var fs = require('fs')
var path = require('path')
var writeFile = require('./write-file')
var minifyHtml = require('./postprocessors/html-minify')

const htmlExts = ['.html', '.htm']

module.exports = function (file, specOptions, callback) {
  var log = function () {
    if (console && specOptions.debug) {
      console.log.apply(console, arguments)
    }
  }

  file = file.replace(process.cwd() + '/', '')

  fs.readFile(file, function (err, html) {
    if (err) {
      return callback(err)
    }

    const extension = path.extname(file)
    if (htmlExts.includes(extension)) {
      html = minifyHtml(html.toString())
    }

    var partPath = specOptions.outputDir + '/' + file
    var outFile = process.cwd() + partPath
    log('  copying:', partPath)
    writeFile(outFile, html, callback)
  })
}
