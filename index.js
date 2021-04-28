#!/usr/bin/env node

const watchSassArchiteture = require("./bin/watch-sass-architecture")

const argv = require("yargs")
.option('watch', {
    alias: 'w',
    describe: 'To watch file, inside of ./src/scss/ folder.'
  })
  .demandOption(['watch'], 'Please provide --watch flag To Watch files')
  .help().argv;

if (argv.watch) {
    watchSassArchiteture();
} else {
  console.log("Something else is going on :/");
}
