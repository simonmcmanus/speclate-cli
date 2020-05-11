var chokidar = require('chokidar')
var buildScss = require('../preprocessors/scss-global')
const notify = require('./notify')

var log = require('../log')

module.exports = (spec, speclate) => {
  buildScss(spec, speclate, (err, result) => {
    if (err) {
      return notify({
        title: 'SCSS Error',
        message: err.message
      })
    }
    if (!result) {
      return
    }

    chokidar.watch(result.stats.includedFiles, {
      persistent: true
    }).on('change', function (spec, path) {
      log.alert('Rebuild triggered by SCSS change: ')
      log.alert(path.replace(process.cwd(), ''))

      buildScss(spec, speclate, (err) => {
        if (err) {
          return notify({
            title: 'SCSS Error',
            message: err.message
          })
        }
        log.success(' ---- Build complete ----')
      })
    }.bind(null, spec))
  })
}
