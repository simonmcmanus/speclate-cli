var chalk = require('chalk')

module.exports = {
  // error:
  // warning:  
  alert: (text) => { // something has changed
    console.error(chalk.grey(text))
  },
  debug: (text) => {
    //console.log(chalk.grey(text))
  },
  info: (text) => {
    console.log(' ')
    console.log(chalk.blue(text))
  },
  success: (text) => {
    console.log(chalk.green('   ' + text))
  }
};
