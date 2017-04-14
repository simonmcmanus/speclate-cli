const NotificationCenter = require('node-notifier/notifiers/notificationcenter')

var options = {
  sound: true,
  timeout: 40,
  withFallback: false
}

module.exports = function (message) {
  new NotificationCenter(options).notify(message)
}
