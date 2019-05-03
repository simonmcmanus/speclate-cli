var chokidar = require('chokidar')
var moveFile = require('../move-file')
const notify = require('./notify')
var log = require('../log')

module.exports = (spec, options, speclate) => {
  chokidar.watch(options.files, {
    persistent: true
  }).on('change', function (spec, path) {
    log.alert('Move triggered by file change: ')
    log.alert(path.replace(process.cwd(), ''))

    moveFile(path, options, function (err) {
      if (err) {
        return notify({
          title: 'Move Error',
          message: err.message
        })
      }
      log.debug(`moved ${path}`)
    })
  }.bind(null, spec))
}
