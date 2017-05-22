'use strict'

var path = require('path')
var async = require('async')
var execFile = require('child_process').execFile
var binPath = require('webp-bin').path

module.exports = function (spec, speclate, callback) {
  var supported = ['.png', '.jpg', '.jpeg']
  var images = spec.options.files.filter(function (item) {
    return supported.includes(path.extname(item))
  })

  async.forEach(images, function (image) {
    var outFile = path.join(process.cwd(), spec.options.outputDir, '/', image)
    var ext = path.extname(outFile)
    var output = outFile.replace(ext, '.webp')
    var cmd = image + ' -q 80 -o ' + output

    execFile(binPath, cmd.split(/\s+/), function (err, stdout, stderr) {
      console.log(err, stdout)
    })
  }, callback)
}
