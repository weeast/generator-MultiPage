var env = require('../environments');
var defaultConfig = require('./common.config')();

module.exports = function makeClientConfig(type) {
    return require('./' + (type || env.NODE_ENV) + '.config')(defaultConfig);
};