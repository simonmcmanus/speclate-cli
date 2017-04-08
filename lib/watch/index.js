#!/usr/bin/env node




const watchHtml = require('./html')
const watchFiles = require('./files')
const watchScss = require('./scss')

module.exports = (spec, speclate, port) => {
  watchHtml(spec, speclate)
  watchFiles(spec, speclate)
  watchScss(spec, speclate)
}



