import minimist from 'minimist';

var argv = minimist(process.argv.slice(2));

console.log(JSON.stringify(argv._));
console.log('Done');
