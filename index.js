var generateMarkup = require('./lib/generate-markup')
var generateApi = require('./lib/generate-api')
var moveFiles = require('./lib/move-files')
var schema = require('./lib/schema')
var server = require('./lib/server')
var async = require('async')
var path = require('path')
var packagePath = path.join(__dirname, '/package.json')
var pkg = require(packagePath)
var program = require('commander')

module.exports = function (spec, speclate, speclateVersion) {
  console.log('Speclate v' + speclateVersion, 'cli v' + pkg.version)

  program
    .version('0.0.1')
    .option('-A, --all', 'run all commands')
    .option('-S, --specs', 'generate spec api files')
    .option('-D, --debug', 'run a development server')
    .option('-F, --files', 'Move files')
    .option('-V, --validate', 'validate schema')
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
      generateMarkup(spec, speclate, next)
    },
    specs: (next) => {
      console.log('')
      console.log('Generating API..')
      generateApi(spec, speclate, next)
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
      server(spec)
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
