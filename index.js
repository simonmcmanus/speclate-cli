// this file needs a good old clean up. sorry. :/

var generateMarkup = require('./lib/generate-markup')
var generateApi = require('./lib/generate-api')
var appCache = require('./lib/app-cache')
var moveFiles = require('./lib/move-files')
var watch = require('./lib/watch')
var schema = require('speclate-schema')
var server = require('./lib/server')
var async = require('async')
var path = require('path')
var packagePath = path.join(__dirname, '/package.json')
var pkg = require(packagePath)
var program = require('commander')

module.exports = function (spec, speclateVersion) {
  console.log('Speclate v' + speclateVersion, 'cli v' + pkg.version)

  program
    .version(pkg.version)
    .option('-A, --all', 'run all commands')
    .option('-S, --specs', 'generate api files')
    .option('-D, --debug [port]', 'run a development server')
    .option('-W, --watch', 'watch for changes')
    .option('-F, --files', 'Move files')
    .option('-V, --validate', 'validate schema')
    .option('-C, --appcache', 'Generate app cache manifest file')
    .option('-M, --markup', 'generate markup')
    .parse(process.argv)

  var methods = {
    validate: (next) => {
      console.log('')
      console.log('Validating spec..')
      schema.validate(spec)
      console.log('  ok')
      next()
    },
    markup: (next) => {
      console.log('')
      console.log('Generating markup..')
      generateMarkup(spec, next)
    },
    watch: (next) => {
      console.log('')
      console.log('Watch ..')
      watch(spec, next)
    },
    specs: (next) => {
      console.log('')
      console.log('Generating API..')
      generateApi(spec, next)
    },
    appcache: (next) => {
      console.log('')
      console.log('Generating Manifest file..')
      appCache(spec, next)
    },
    files: (next) => {
      console.log('')
      console.log('Moving files..')
      moveFiles(spec, next)
    }
  }

  if (program.all) {
    async.series(methods)
  } else {
    var run = []

    schema.validate(spec)

    if (program.debug) {
      server(spec, program.debug)
    }

    if (program.watch) {
      watch(spec, program.debug)
    }

    if (program.markup) {
      run.push(methods.markup)
    }

    if (program.api) {
      run.push(methods.api)
    }

    if (program.files) {
      run.push(methods.files)
    }

    async.series(run)
  }
}
