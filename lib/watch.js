#!/usr/bin/env node

var nodemon = require('./node_modules/bin/nodemon')
var moveFile = require('./move-file')

module.exports = function (spec, port) {

  spec.options.files.push('pages/layout.html', 'pages', 'components', 'spec.js', 'client/index-compiled.js')

  nodemon({
    watch: spec.options.files,
    ext: 'html js json scss css'
  })

  nodemon.on('start', function () {
    console.log('App has started')
  }).on('quit', function () {
    console.log('App has quit')
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files)
    files.forEach(function (file) {
      file = file.replace(process.cwd() + '/', '')

      if (file === 'spec.js') {
        return console.error('spec reloading not supported, please rebuild')
      }

      if (file.slice(0, 5) === 'pages') {
        return console.error('page reloading not supported, please rebuild')
      }


      if (file.slice(0, 10) === 'components') {
        return console.error('component reloading not supported, please rebuild')
      }

      moveFile(file, spec.options, function (err) {
        if (err) {
          return console.log(err)
        }
        console.log('moved', file)
      })
    })
  })
}



