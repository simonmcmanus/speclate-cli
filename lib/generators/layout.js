'use strict'
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
var chalk = require('chalk')

module.exports = function (spec, speclate, callback) {
  const layoutPath = 'pages/layout.html'
  fs.readFile(layoutPath, 'utf8', (err, layout) => {
    if (err) throw err

    const $ = cheerio.load(layout)
    $('html').attr('data-speclate-render', 'layout-first')
    const output = $.html()
    var shortPath = path.join(spec.options.outputDir, layoutPath)
    const outPath = path.join(process.cwd(), shortPath)
    fs.writeFile(outPath, output, (err) => {
      if (err) throw err
      console.log(chalk.grey('  writing: ', shortPath))
      callback()
    })
  })
}
