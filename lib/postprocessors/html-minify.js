'use strict';

var minify = require('html-minifier').minify

module.exports = function (html) {
  var result = minify(html, {
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    removeComments: true
  })
  return result
}
