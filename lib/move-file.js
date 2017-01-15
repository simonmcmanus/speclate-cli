var fs = require('fs')
var writeFile = require('./write-file')

module.exports = function (file, specOptions, callback) {


  file = file.replace(process.cwd() + '/', '')

  fs.readFile(file, function (err, buffer) {
    if (err) {
      console.log(err)
      return callback(err)
    }

    var partPath = specOptions.outputDir + '/' + file
    var outFile = process.cwd() + partPath
    console.log('  copied:', partPath)
    writeFile(outFile, buffer, callback)
  })
}
