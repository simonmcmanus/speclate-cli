var chalk = require('chalk')

module.exports = {
    error: (error) => {
     console.log('✖', error)
   },
  // warning:  
  alert: (text) => { // something has changed
    console.error(chalk.grey(text))
  },
  debug: (text) => {
    if (process.env.DEBUG) {
      console.log('ℹ', chalk.grey(text))
    }
  },
  info: (text) => {
    console.log(' ')
    console.log(chalk.blue(text))
  },
  success: (text) => {
    console.log(chalk.green('   ' + text), '✔')
  }
};
