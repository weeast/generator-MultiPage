'use strict';

// navtive modules
var http = require('http');
var path = require('path');
var util = require('util');

// 3rd modules
var argv = require('yargs').argv;
var express = require('express');
var logger = require('morgan');
var colors = require('colors');
var open = require('open');
var favicon = require('serve-favicon');

// middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// glob variables
var env = require(path.join(__dirname, '../configs/environments/index'));
var pkg = require(env.inProject('package.json'));
var debug = env.__DEV__;

// load routes
var routes = require('./routes');

// load webpack-dev
// var webpackDev = require('./webpack');

// init framework
var app = express();

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'jade');

// console color theme
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
})

// use middleware
app.use(logger('dev'));
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());*/

// use routes
app.use('/', routes);

if (debug) {
    // webpack develop middleware & webpack hot middleware
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    // load middleware configs
    var webpackConf = require(env.inProject(env.DIR_CONFIG, 'webpack/build.config'))('development');
    var devSeverConf = require(env.inProject(env.DIR_CONFIG, 'webpack-dev-middleware/index'));

    var compiler = webpack(webpackConf);

    app.use(webpackDevMiddleware(compiler,devSeverConf));

    app.use(webpackHotMiddleware(compiler));
}

// production static files
app.use(express.static(env.inDist('assets')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


// get port from package
var port = env.SERVER_PORT;
app.set('port', port);

// create HTTP server
var server = http.createServer(app);

server.listen(port);

server.on('error', function(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function() {
    var url = util.format('http://%s:%d', 'localhost', env.SERVER_PORT)

    console.log('Listening at %s', url)

    open(url)
});