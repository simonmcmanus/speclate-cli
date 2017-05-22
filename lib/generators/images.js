



var path = require('path')
var async = require('async')
var sharp = require('sharp')
var mkdirp = require('mkdirp')

module.exports = function (spec, speclate, callback) {
  var images = []
  Object.keys(spec.options.images).forEach((image) => {
    Object.keys(spec.options.images[image]).forEach((size) => {
      var ext = path.extname(image)

      var outFile = image.slice(0, -ext.length) + '-' + size
      var outPath = path.join(process.cwd(), spec.options.outputDir, outFile)

      var updateImage = {
        output: outPath + ext,
        webp: outPath + '.webp',
        input: path.join(process.cwd(), image),
        name: size,
        size: spec.options.images[image][size].size
      }
      images.push(updateImage)
    })
  })

  async.each(images, function (image, next) {
    var folder = path.dirname(image.output)
    mkdirp(folder, (err) => {
      sharp(image.input)
        .resize(image.size.width, image.size.height)
        .toFile(image.output, (err) => {
          if (err) {
            throw err
          }
          next()
        })
        // .toFile(image.webp, (err) => {
        //   if (err) {
        //     throw err
        //   }
        //   next()
        // })
    })
  }, callback)
}
