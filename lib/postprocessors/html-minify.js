'use strict';

var minify = require('html-minifier').minify

module.exports = function (html) {
  if (process.env.NODE_ENV !== 'production') {
    return html
  }
  var result = minify(html, {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    removeComments: true
  })
  return result
}
