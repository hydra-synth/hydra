var bundle = require('browserify')({standalone: 'getScreenMedia'});
var fs = require('fs');

bundle.add('./getscreenmedia');
bundle.bundle().pipe(fs.createWriteStream('getscreenmedia.bundle.js'));
