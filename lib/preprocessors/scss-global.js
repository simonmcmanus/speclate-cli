const path = require('path')
const sass = require('node-sass')
const async = require('async')
const fs = require('fs')
const chalk = require('chalk')


var fileExists = (filePath, callback) => {
  const location = path.join(process.cwd(), filePath)
  fs.access(location, function (err) {
    callback(null, !err)
  })
}

module.exports = function (spec, speclate, callback) {
  const files = fileList(spec)

  async.filter(files, fileExists, (err, existingFiles) => {

    if (err || !existingFiles.length) {
      return callback(err)
    }

    const scss = existingFiles.map((file) => {
      return '@import \'' + file + '\';'
    }).join('\n;')


    const outFile = path.join(process.cwd(), './client/global-styles-compiled.css')


    var isDev = (process.env.NODE_ENV !== 'production')

    sass.render({
      file: outFile,
      outFile: outFile,
      data: scss,
      includePaths: [process.cwd()],
      outputStyle: isDev ? 'expanded' : 'compressed',
      sourceMapEmbed: isDev,
      sourceMaps: isDev
    }, (err, result) => {
      if (err) {
        return callback(err)
      }
      fs.writeFile(outFile, result.css, (err) => {
        if (err) {
          callback(new Error('Error writing CSS file.'))
        }
        console.log(chalk.grey('  written: ' + outFile))
        console.log(chalk.green('  ok'))
        callback(null, result)
      })
    })
  })
}

// gets a list of the files from the spec.
const fileList = exports.files = function (spec) {
  const scssFiles = ['pages/layout.scss']

  Object.keys(spec).forEach(function (page) {
    if (page === 'options' || page === 'defaultSpec') {
      return
    }

    var pageName = spec[page].page

    const pageScss = path.join('pages/', pageName, '/', pageName + '.scss')
    scssFiles.push(pageScss)

    for (var selector in spec[page].spec) {
      var component = spec[page].spec[selector].component
      if (component) {
        const pageScss = path.join('components/', pageName, '/', pageName + '.scss')
        scssFiles.push(pageScss)
      }
    }
  })
  return scssFiles
}
