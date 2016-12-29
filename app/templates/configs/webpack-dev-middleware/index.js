var argv = require('yargs').argv;
var env = require('../environments');

var QUIET_MODE = !!argv.quiet;

var devConf = {
    // all options optional

    noInfo: QUIET_MODE,
    // display no info to console (only warnings and errors)

    quiet: false,//QUIET_MODE,
    // display nothing to the console

    hot: true,

    publicPath: env.PUBLIC_PATH,
    // public path to bind the middleware to
    // use the same as in webpack

    headers: { "X-Custom-Header": "yes" },
    // custom headers

    stats: {
        cached: false,
        colors: true
    }
    // options for formating the statistics
}

module.exports = exports = devConf;

    