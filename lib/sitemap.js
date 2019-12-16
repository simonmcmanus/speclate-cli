var writeFile = require('./write-file')
var log = require('./log')

module.exports = (spec, speclate, next) => {

  if (!spec.options.domain) {
    return next()
  }
  var routes = Object.assign({}, spec)
  delete routes.options
  delete routes.defaultSpec
  var routesArr = Object.keys(routes).map((route) => {
    return spec.options.domain + route
  })
  var file = routesArr.join('\n')
  var filePath = process.cwd() + spec.options.outputDir + '/sitemap.txt'
  writeFile(filePath, file, (err, data) => {
    if (!err) {
      log.debug(`written ${filePath}`)
      log.success('ok')
    }
    next(err, data)
  })
}
