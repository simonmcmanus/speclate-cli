

var DEFAULT_PORT = 5002
var ServeMe = require('serve-me')
var path = require('path')

module.exports = function (options, port) {
  port = port || DEFAULT_PORT
  var dir = path.join(process.cwd(), options.outputDir)
  var serveMe = ServeMe({
    debug: true,
    directory: dir
  })
  console.log('Serving files from:', dir)
  serveMe.start(port)
  console.log('http://127.0.0.1:' + port)
}
