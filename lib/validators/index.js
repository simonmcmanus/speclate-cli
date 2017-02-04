


const w3c = require('./w3c')


module.exports = (item, callback) => {
  // this will eventually need to support multiple user configured validators.
  // Validators may one day be able to modify the output too.

  w3c(item, callback)
}
