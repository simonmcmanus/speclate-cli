var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')

module.exports = function (file, buffer, callback) {
  var folder = path.dirname(file)
  mkdirp(folder, function (err) {
    if (err) {
      return callback(err)
    }
    return fs.writeFile(file, buffer, 'utf8', callback)
  })
}
