var pkg = require('../package.json');
var extend = require('node.extend');
var grunt = require('grunt');

var platform = grunt.option('platform');
grunt.verbose.writeln('Platform:', platform);

var proxy = grunt.option('proxy');
grunt.verbose.writeln('Proxy:', proxy);

var mock = grunt.option('mock');
grunt.verbose.writeln('Mock:', mock);

module.exports = extend(true, {}, pkg, {
    env: 'dev',
    apiEndpoint: proxy ? '/api' : '---backend-url---',
    ngCordovaScript: mock ? 'js/ng-cordova-mocks.js' : 'js/ng-cordova.js',
    ngCordovaModuleName: mock ? 'ngCordovaMocks' : 'ngCordova',
    debug: '',
    csp: "default-src 'self' 'unsafe-inline' http://*:35729 ws://*:35729 wss: cdvfile: filesystem: gap: https://ssl.gstatic.com;",
    trackerId: ''
});
