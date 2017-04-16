var async = require('async')

var schema = require('speclate-schema')
var generateMarkup = require('./generate-markup')
var generateApi = require('./generate-api')
var generateCss = require('./preprocessors/scss-global')
var appCache = require('./app-cache')
var dynamicRoutes = require('./dynamic-routes')
var Sitemap = require('./sitemap')
var moveFiles = require('./move-files')
var chalk = require('chalk')

module.exports = (spec, speclate, callback) => {

  let validSpec
  var methods = [
    (next) => {
      console.log('')
      console.log(chalk.blue('Validating spec..'))
      validSpec = schema.validate(spec)
      console.log(chalk.green('ok'))
      next()
    },
    (next) => {
      console.log('')
      console.log(chalk.blue('Generating dynamic routes from spec..'))
      validSpec = dynamicRoutes(spec)
      console.log(chalk.green('ok'))
      next()
    },
    (next) => {
      console.log('')
      console.log(chalk.blue('Generating markup..'))
      generateMarkup(validSpec, speclate, next)
    },
    (next) => {
      console.log('')
      console.log(chalk.blue('Generating API..'))
      generateApi(validSpec, speclate, next)
    },
    (next) => {
      console.log('')
      console.log(chalk.blue('Generating Sitemap..'))
      Sitemap(validSpec, speclate, next)
    },
    (next) => {
      if (validSpec.options.build && validSpec.options.build.css === 'scss-global') {
        // only curently supports scss global but its easy to add others, this could also take a func
        console.log('')
        console.log(chalk.blue('Generating CSS..'))
        return generateCss(validSpec, speclate, next)
      }
      next()
    },
    (next) => {
      console.log('')
      console.log(chalk.blue('Generating Manifest file..'))
      appCache(validSpec, speclate, next)
    },
    (next) => {
      console.log('')
      console.log(chalk.blue('Moving files..'))
      moveFiles(validSpec, next)
    }
  ]
  async.series(methods, callback)
}
