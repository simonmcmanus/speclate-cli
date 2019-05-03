
const request = require('superagent')
const chalk = require('chalk')

module.exports = function (item, callback) {

  request.post('https://validator.w3.org/nu/?out=json')
    .set('Content-Type', 'text/html; charset=utf-8')
    .send(item.markup)
    .end((err, res) => {
      if (err) {
        return callback(err)
      }

      if (res.body.messages.length) {
        console.log('W3C Validation errors found in  ' + item.name)

        res.body.messages.forEach((message) => {
          console.log(message.type + ' line ' + message.lastLine + ' ' + item.name )

          console.log('    ' + chalk.grey(message.extract))
          console.log('    ' + message.message)

        });

        callback(res.body.messages)
      } else {
        callback(null)
      }
  })
};