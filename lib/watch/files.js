

var chokidar = require('chokidar')
const chalk = require('chalk')
var moveFile = require('../move-file')
const notify = require('./notify')

module.exports = (spec, speclate) => {
  chokidar.watch(spec.options.files, {
    persistent: true
  }).on('change', function (spec, path) {
    console.log(' ')
    console.error(chalk.yellow('Move triggered by file change: '))
    console.error(chalk.grey(path.replace(process.cwd(), '')))
    console.log(' ')

    moveFile(path, spec.options, function (err) {

      if (err) {
        return notify({
          title: 'Move Error',
          message: err.message
        })
      }
      console.log('      moved: ', path)
    })
  }.bind(null, spec))
}
