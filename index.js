#!/usr/bin/env node

var generateMarkup = require('./lib/generate-markup')
var generateApi = require('./lib/generate-api')
var moveFiles = require('./lib/move-files')
var schema = require('./lib/schema')
/**
 * Module dependencies.
 */

var program = require('commander');

module.exports = function(spec) {

    program
    .version('0.0.1')
    .option('-A, --all', 'run all commands')
    .option('-S, --specs', 'generate spec api files')
    .option('-F, --files', 'Move files')
    .option('-V, --validate', 'validate schema')
    .option('-M, --markup [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

    if(program.all ) {
        console.log('Validating..');
        schema.validate(spec);
        console.log('Generating markup..');
        generateMarkup(spec);
        console.log('Generating markup..');
        generateApi(spec);
        console.log('Moving files..')
        moveFiles(spec);
        return;
    }

    if (program.validate) {
        console.log('Validating..');
        schema.validate(spec);
    }

    if (program.markup) {
        console.log('Generating markup..');
        generateMarkup(spec);
    }

    if (program.api) {
        console.log('Generating markup..');
        generateApi(spec);
    }

    if (program.files) {
        console.log('Moving files..')
        moveFiles(spec);
    }

}
