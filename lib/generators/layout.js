'use strict'
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
var writeFile = require('../write-file')
var minifiy = require('../postprocessors/html-minify')
var log = require('../log')

module.exports = function (spec, speclate, callback) {
  const layoutPath = path.join(process.cwd(), 'pages/layout.html')
  fs.readFile(layoutPath, 'utf8', (err, layout) => {
    if (err) throw err

    const $ = cheerio.load(layout)
    $('html').attr('data-speclate-render', 'layout-first')
    const output = minifiy($.html())
    var shortPath = path.join(spec.options.outputDir, 'pages/layout.html')
    const outPath = path.join(process.cwd(), shortPath)
    writeFile(outPath, output, (err) => {
      if (err) throw err
      log.debug(` writing: ${shortPath}`)
      callback()
    })
  })
}
