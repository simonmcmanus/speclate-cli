var fs = require('fs')
var path = require('path')
var writeFile = require('./write-file')
var minifyHtml = require('./postprocessors/html-minify')

const htmlExts = ['.html', '.htm'];

module.exports = function (file, specOptions, callback) {

  var log = function () {
    if (console && specOptions.debug) {
      console.log.apply(console, arguments)
    }
  }

  file = file.replace(process.cwd() + '/', '')

  log('read file', file)

  const extension = path.extname(file)
  var isHtml = htmlExts.includes(extension)

  var moveFile = function (err, file) {

    if (err) {
      return callback(err)
    }

    if (this.transform) {
      file = this.transform(file)
    }

    var partPath = specOptions.outputDir + '/' + file
    var outFile = process.cwd() + partPath
    log('  copying:', partPath)
    writeFile(outFile, file, callback)
  }

  if (isHtml) {
    fs.readFile(file, 'utf8', moveFile)
  } else {
    fs.readFile(file, moveFile).bind({ transform: minifyHtml })
  }

  fs.readFile(file, 'utf8', function (err, html) {
    if (err) {
      return callback(err)
    }

    if (htmlExts.includes(extension)) {
      html = minifyHtml(html)
    }

    var partPath = specOptions.outputDir + '/' + file
    var outFile = process.cwd() + partPath
    log('  copying:', partPath)
    writeFile(outFile, html, callback)
  })
}
