var fs = require('fs')
var path = require('path')
var writeFile = require('./write-file')


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
  if (htmlExts.includes(extension)) {

  }


  fs.readFile(file, function (err, buffer) {
    if (err) {
      return callback(err)
    }

    var partPath = specOptions.outputDir + '/' + file
    var outFile = process.cwd() + partPath
    log('  copying:', partPath)
    writeFile(outFile, buffer, callback)
  })
}
