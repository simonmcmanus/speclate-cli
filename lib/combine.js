'use strict'

/* Combine specs from components - expereimental - only supports options.images property */

var _ = require('lodash')
var path = require('path')

module.exports = function (spec, speclate, callback) {
  Object.keys(spec).forEach((route) => {
    if (route === 'options' || route === 'defaultSpec') {
      return false
    }
    var pageSpec = spec[route].spec
    Object.keys(pageSpec).forEach((selector) => {
      var component = pageSpec[selector].component
      if (component) {
        var compSpec = getComponent(component)
        if (compSpec) {
          spec = _.merge(spec, compSpec)
        }
      }
    })
  })
  return spec
}

var getComponent = (component) => {
  var specPath = path.join(process.cwd(), '/components/', component, '/', 'spec.js')
  try {
    var componentSpec = require(specPath)
  } catch (e) {
    return false
  }
  return updateComponentPaths(componentSpec, component)
}

var updateComponentPaths = (componentSpec, component) => {
  var pathImages = {}

  Object.keys(componentSpec.options.images).forEach((image, index, images) => {
    var fullPath = path.join('/components/', component, '/', image)
    pathImages[fullPath] = componentSpec.options.images[image]
  })
  componentSpec.options.images = pathImages
  return componentSpec
}
