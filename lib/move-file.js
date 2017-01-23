var fs = require('fs')
var writeFile = require('./write-file')



module.exports = function (file, specOptions, callback) {

  var log = function () {
    if (console && specOptions.debug) {
      console.log.apply(console, arguments)
    }
  }



  file = file.replace(process.cwd() + '/', '')


  log('read file', file)
  fs.readFile(file, function (err, buffer) {
    if (err) {
      return log('read file error', file, err)
    }

    var partPath = specOptions.outputDir + '/' + file
    var outFile = process.cwd() + partPath
    log('  copying:', partPath)
    writeFile(outFile, buffer, callback)
  })
}
