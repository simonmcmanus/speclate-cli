
  // scss

var chokidar = require('chokidar')
const chalk = require('chalk')
var buildScss = require('../preprocessors/scss-global')

module.exports = (spec, speclate) => {
  buildScss(spec, speclate, (err, result) => {

    if (err) {
      throw err
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
          throw err
        }
        console.log(chalk.green('build complete'))
      })
    }.bind(null, spec))
  })
}
