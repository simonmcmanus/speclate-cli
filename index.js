
var watch = require('./lib/watch')
var build = require('./lib/build')
var schema = require('speclate-schema')
var server = require('./lib/server')
var path = require('path')
var packagePath = path.join(__dirname, '/package.json')
var pkg = require(packagePath)
var program = require('commander')

module.exports = function (inputSpec, speclate, callback) {
  console.log('Speclate v' + speclate.version, 'cli v' + pkg.version)

  program
    .version(pkg.version)
    .option('-B, --build', 'Build speclate site for the current directory')
    .option('-D, --dev [port]', 'Run a local development server')
    .option('-W, --watch', 'watch for changes')
    .parse(process.argv)

  var { options, spec } = schema.validate(inputSpec)

  if (program.build) {
    build(spec, options, speclate, callback)
  }

  if (program.dev) {
    server(options, program.dev)
  }

  if (program.watch) {
    watch(spec, options, speclate, program.debug)
  }
}
