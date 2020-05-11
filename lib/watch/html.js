
var path = require('path')
var chokidar = require('chokidar')
var build = require('../build')
const notify = require('./notify')

var log = require('../log')

module.exports = (spec, options, speclate) => {
  const rebuildGlobs = [
    path.join(process.cwd(), './spec.js'),
    path.join(process.cwd(), './*.spec.js'),
    path.join(process.cwd(), './pages/layout.html'),
    path.join(process.cwd(), './pages/*/**.html'),
    path.join(process.cwd(), './components/*/*.html')
  ]

  chokidar.watch(rebuildGlobs, {
    persistent: true
  }).on('change', function (spec, path) {
    log.alert('Rebuild triggered by pages change: ')
    log.alert(path.replace(process.cwd(), ''))

    if (path.slice(-7) === 'spec.js') {
      // spec has changed, lets reload it
      delete require.cache[path]
      spec = require(path)
    }

    build(spec, options, speclate, (err) => {
      if (err) {
        return notify({
          title: 'HTML Error',
          message: err.message
        })
      }
      log.success('ok')
    })
  }.bind(null, spec))
}
