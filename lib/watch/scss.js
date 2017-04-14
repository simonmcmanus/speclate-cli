
  // scss

var chokidar = require('chokidar')
const chalk = require('chalk')
var buildScss = require('../preprocessors/scss-global')
const notify = require('./notify')

module.exports = (spec, speclate) => {
  buildScss(spec, speclate, (err, result) => {

    if (err) {
      return notify({
        title: 'SCSS Error',
        message: err.message
      })
    }

    chokidar.watch(result.stats.includedFiles, {
      persistent: true
    }).on('change', function (spec, path) {
      console.log(' ')
      console.error(chalk.yellow('Rebuild triggered by SCSS change: '))

      console.error(chalk.grey(path.replace(process.cwd(), '')))
      console.log(' ')

      buildScss(spec, speclate, (err) => {
        if (err) {
          return notify({
            title: 'SCSS Error',
            message: err.message
          })
        }
        console.log(chalk.green('build complete'))
      })
    }.bind(null, spec))
  })
}
