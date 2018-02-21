var bundle = require('browserify')({ standalone: 'getUserMedia' }),
    fs = require('fs');


bundle.add('./getusermedia');
bundle.bundle().pipe(fs.createWriteStream('getusermedia.bundle.js'));
