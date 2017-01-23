#!/usr/bin/env node

var nodemon = require('nodemon')
var moveFile = require('./move-file')
var generateMarkup = require('./lib/generate-markup')
var generateApi = require('./lib/generate-api')


var rebuild = function(spec) {

        generateMarkup(spec, function() {
          console.log('Markup Generated')
        })

        generateApi(spec, function() {
          console.log('API Generated')
        })
};


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
    files.forEach(function (filePath) {
      var file = filePath.replace(process.cwd() + '/', '')

      if (file === 'spec.js') {

        spec = require(file)
        console.error('spec reload')
        return rebuild(spec)
      }

      if (file.slice(0, 5) === 'pages') {
        console.error('page reloading')
        return rebuild(spec)
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



