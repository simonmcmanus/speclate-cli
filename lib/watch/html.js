
var path = require('path')
var chokidar = require('chokidar')
const chalk = require('chalk')
var build = require('../build')
const notify = require('./notify')

module.exports = (spec, speclate) => {

  const rebuildGlobs = [
    path.join(process.cwd(), './spec.js'),
    path.join(process.cwd(), './pages/layout.html'),
    path.join(process.cwd(), './pages/*/**.html'),
    path.join(process.cwd(), './components/*/*.html')
  ]

  chokidar.watch(rebuildGlobs, {
    persistent: true
  }).on('change', function (spec, path) {
    console.log(' ')
    console.error(chalk.yellow('Rebuild triggered by pages change: '))

    console.error(chalk.grey(path.replace(process.cwd(), '')))
    console.log(' ')

    if (path.slice(-7) === 'spec.js') {
      // spec has changed, lets reload it
      delete require.cache[path]
      spec = require(path)
    }

    build(spec, speclate, (err) => {

      if (err) {
        return notify({
          title: 'HTML Error',
          message: err.message
        })
      }
      console.log('build complete')
    })
  }.bind(null, spec))
}
