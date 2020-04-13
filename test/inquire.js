'use strict';
var inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'rawlist',
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        'Order a pizza',
        'Make a reservation',
        new inquirer.Separator(),
        'Ask opening hours',
        'Talk to the receptionist'
      ]
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });