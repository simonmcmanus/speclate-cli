#!/usr/bin/env node

const watchHtml = require('./html')
const watchFiles = require('./files')
const watchScss = require('./scss')

module.exports = (spec, options, speclate) => {
  watchHtml(spec, options, speclate)
  watchFiles(spec, options, speclate)
  watchScss(spec, options, speclate)
}
