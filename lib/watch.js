#!/usr/bin/env node

var nodemon = require('nodemon')
var fs = require('fs')
var moveFile = require('./move-file');

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
console.log(file, 1)
      file = file.replace(process.cwd(), '')
      console.log(file, 2)


      // if pages

      // if components

      // if spec

      // if css - scss?

      // is js - browserify?
      moveFile(file, spec.options, function () {
        console.log('moved', file)
      })
    })
  })
}



