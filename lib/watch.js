#!/usr/bin/env node

var chokidar = require('chokidar')
const chalk = require('chalk')

var path = require('path')
var moveFile = require('./move-file')
var build = require('./build')


module.exports = (spec, port) => {
  const rebuildGlobs = [
    path.join(process.cwd(), './spec.js'),
    path.join(process.cwd(), './pages/layout.html'),
    path.join(process.cwd(), './pages/*/*.html'),
    path.join(process.cwd(), './components/*/*.html')
  ]

  chokidar.watch(rebuildGlobs, {
    persistent: true
  }).on('change', (path) => {
    console.log(' ')
    console.error(chalk.yellow('Rebuild triggered by pages change: '))

    console.error(chalk.grey(path.replace(process.cwd(), '')))
    console.log(' ')

    if (path.slice(-7) === 'spec.js') {
      // spec has changed, lets reload it
      delete require.cache[path]
      spec = require(path)
    }

    console.log(path)
    build(spec, (err) => {
      if (err) {
        throw err
      }
      console.log('build complete')
    })
  })


  chokidar.watch(spec.options.files, {
    persistent: true
  }).on('change', (path) => {
    console.log(' ')
    console.error(chalk.yellow('Move triggered by pages change: '))
    console.error(chalk.grey(path.replace(process.cwd(), '')))
    console.log(' ')


    moveFile(path, spec.options, function (err) {
      if (err) {
        return console.log(err)
      }
      console.log('      moved: ', path)
    })
  })
}



