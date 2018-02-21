 /* eslint-env node */
'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'mocha', 'chai'],
    files: [
      'test/rtcpeerconnection.js'
    ],
    exclude: [],
    preprocessors: {
      'test/rtcpeerconnection.js': ['browserify']
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
    browsers: ['Edge'],
    browserify: {
      debug: true,
      transform: ['brfs']
    }
  });
};
