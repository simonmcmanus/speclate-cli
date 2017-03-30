// this file needs a good old clean up. sorry. :/

var watch = require('./lib/watch')
var build = require('./lib/build')
var schema = require('speclate-schema')
var server = require('./lib/server')
var path = require('path')
var packagePath = path.join(__dirname, '/package.json')
var pkg = require(packagePath)
var program = require('commander')

module.exports = function (spec, speclate, callback) {
  console.log('Speclate v' + speclate.version, 'cli v' + pkg.version)

  program
    .version(pkg.version)
    .option('-B, --build', 'Build speclate site for the current directory')
    .option('-D, --dev [port]', 'Run a local development server')
    .option('-W, --watch', 'watch for changes')
    .parse(process.argv)

  schema.validate(spec)

  if (program.build) {
    build(spec, speclate, callback)
  }

  if (program.dev) {
    server(spec, program.dev)
  }

  if (program.watch) {
    watch(spec, speclate, program.debug)
  }
}

