#!/usr/bin/env node

var PORT = 5002
var ServeMe = require('serve-me')
var path = require('path')

module.exports = function (spec) {
  var dir = path.join(process.cwd(), spec.options.outputDir)
  var serveMe = ServeMe({
    debug: true,
    directory: dir
  })
  serveMe.start(PORT)
  console.log('http://127.0.0.1:' + PORT)
}
