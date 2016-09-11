var generateMarkup = require('./lib/generate-markup')
var generateApi = require('./lib/generate-api')
var moveFiles = require('./lib/move-files')
var schema = require('./lib/schema')
var async = require('async')
var package = require(__dirname + '/package.json');
var program = require('commander');

module.exports = function(spec, speclateVersion) {

    console.log('Speclate v' + speclateVersion, 'cli v' + package.version)

    program
    .version('0.0.1')
    .option('-A, --all', 'run all commands')
    .option('-S, --specs', 'generate spec api files')
    .option('-F, --files', 'Move files')
    .option('-V, --validate', 'validate schema')
    .option('-M, --markup', 'generate markup')
    .parse(process.argv);

    var methods = {
        validate: (next) => {
            console.log('')
            console.log('Validating spec..');
            schema.validate(spec);
            console.log('  ok')
            next();
        },
        markup: (next) => {
            console.log('')
            console.log('Generating markup..');
            generateMarkup(spec, next);
        },
        api: (next) => {
            console.log('')
            console.log('Generating API..');
            generateApi(spec, next);

        },
        files: (next) => {
            console.log('')
            console.log('Moving files..')
            moveFiles(spec, next);
        }
    }

    if(program.all) {
        async.series(methods);
    } else {
        var run = [];

        if (program.validate) {
            schema.validate(spec);
        }

        if (program.markup) {
            run.push(methods.markup);
        }

        if (program.api) {
            run.push(methods.api);
        }

        if (program.files) {
            run.push(methods.files);
        }

        async.series(run);
    }
}
