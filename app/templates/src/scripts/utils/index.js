// exports
var guid = 0,
    EMPTY = '';

var locations = require('JS/utils/locations');
var array = require('./lang/array');
var number = require('./lang/number');
var object = require('./lang/object');
var string = require('./lang/string');


var host = location.host;
var apiPath;

if(host.match('cbss')){
    apiPath = 'http://'+host+'/app/dota2';
}else{
    apiPath = '';
}

module.exports = {
    env: {
        dev: true,
        host: window,
        dbPath: 'http://dota2.766.com',
        staticPath: 'http://static.a.carry6.com/coachtool',
        apisPath: apiPath//'http://cbss.api.766.com/app/dota2' 
    },
    version: '',
    log: function(msg, cat, src) {

    },
    error: function(msg) {

    },
    guid: function(pre) {
        return (pre || EMPTY) + guid++;
    },
    now: function() {
        return Date.now();
    },
    type: function(filename) {
        var tags = document.getElementsByTagName('script');
        for (var i = 0; i < tags.length; ++i) {
            var path = tags[i].src;
            if (path.match(filename + '.js')) {
                return locations.getParm('t', path);
            }
        }
    },
    location: locations,
    array: array,
    number: number,
    object: object,
    string: string,
    time: require('./time')
};