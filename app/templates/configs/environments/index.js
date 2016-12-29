'use strict';

process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim();

var vendors = require('./dependencies').vendors;
var aliases = require('./dependencies').aliases;

var resolve = require('path').resolve;
var argv = require('yargs').argv;
var _slice = [].slice;

var DIR_SRC = 'src';
var DIR_DIST = 'dist';
var DIR_CONFIG = 'configs';
var DIR_NODEMOD = 'node_modules';
var PROJECT_PATH = resolve(__dirname, '../../');
var PUBLIC_PATH =  '/'//静态文件发布后路径
var PROXY_ADDR = 'demo.poxyaddress.com';//代理后台域名

function inProject() {
  return resolve.apply(resolve, [PROJECT_PATH].concat(_slice.apply(arguments)));
}

// ------------------------------------
// Configuration Definition
// ------------------------------------
module.exports = exports = {

  // environment
  NODE_ENV: process.env.NODE_ENV,
  __PROD__: !!argv.prod,
  __DEV__: !!argv.dev,
  __DEBUG__: process.env.NODE_ENV === 'development' && !!argv.debug,

  // path helpers
  DIR_SRC: DIR_SRC,
  DIR_DIST: DIR_DIST,
  DIR_CONFIG: DIR_CONFIG,
  DIR_NODEMOD: DIR_NODEMOD,
  PROJECT_PATH: PROJECT_PATH,
  inProject: inProject,
  inSrc: inProject.bind(undefined, DIR_SRC),
  inDist: inProject.bind(undefined, DIR_DIST),
  inNodeMod: inProject.bind(undefined, DIR_NODEMOD),

  // build system 
  VENDOR_DEPENDENCIES: vendors,
  ALIAS: aliases,

  // server configuration
  // WEBPACK_PORT: 3000,
  SERVER_PORT: !!argv.prod ? 3000 : 4000,
  PUBLIC_PATH: process.env.NODE_ENV === 'production' || !!argv.prod ? PUBLIC_PATH : '/',
  PROXY_ADDR: PROXY_ADDR
};