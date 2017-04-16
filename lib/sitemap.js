var writeFile = require('./write-file')
var chalk = require('chalk')

module.exports = (spec, speclate, next) => {

  var routes = Object.assign({}, spec);
  delete routes.options
  delete routes.defaultSpec
  var routesArr = Object.keys(routes);
  var file = routesArr.join('\n');
  var filePath = process.cwd() + spec.options.outputDir + '/sitemap.txt'
  writeFile(filePath, file, (err, data) => {
    if (!err) {
      console.log(chalk.grey('  written: ', filePath))
      console.log(chalk.green('  ok'))
    }
    next(err, data)
  })
}