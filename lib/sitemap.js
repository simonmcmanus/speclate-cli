var writeFile = require('./write-file')
var log = require('./log')

module.exports = (spec, options, next) => {
  if (!options.domain) {
    log.alert('   Skipped as options.domain is blank')
    next()
    return
  }
  var routes = Object.assign({}, spec)
  var routesArr = Object.keys(routes).map((route) => {
    return options.domain + route
  })
  var file = routesArr.join('\n')
  var filePath = process.cwd() + options.outputDir + '/sitemap.txt'
  writeFile(filePath, file, (err, data) => {
    if (!err) {
      log.debug(`written ${filePath}`)
      log.success('ok')
    }
    next(err, data)
  })
}
