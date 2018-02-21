var bundle = require('browserify')(),
    fs = require('fs');

bundle.add('./index');
bundle.bundle({standalone: 'enumerateDevices'}).pipe(fs.createWriteStream('enumerateDevices.bundle.js'));
