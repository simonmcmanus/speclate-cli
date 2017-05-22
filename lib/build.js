var async = require('async')

var schema = require('speclate-schema')

var generateMarkup = require('./generators/markup')
var generateApi = require('./generators/api')
var generateImages = require('./generators/images')
var appCache = require('./generators/app-cache')
var dynamicRoutes = require('./generators/dynamic-routes')

var generateCss = require('./preprocessors/scss-global')
var Sitemap = require('./sitemap')
var moveFiles = require('./move-files')

var combineSpecs = require('./combine')
var chalk = require('chalk')

module.exports = (spec, speclate, callback) => {
  let validSpec
  let completeSpec

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
      console.log(chalk.blue('Combine specs'))
      completeSpec = combineSpecs(validSpec, speclate, next)
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
      console.log(chalk.blue('Generating Images..'))
      generateImages(completeSpec, speclate, next)
      console.log(chalk.green('ok'))
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
