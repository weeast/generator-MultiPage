var Promise = require('es6-promise-polyfill').Promise;
var XBox = require('JS/plugins/xbox');
var utils = require('JS/utils');

// var es6promise = require('promise');
// var promise = es6promise.Promise;

function jsonParse(value) {
    if (typeof value === 'string') {
        return JSON.parse(value);
    }
    return value;
}

function preParse(pre, value) {
    if (!pre) return value;
    if (value.code === 1)
        return value.data || value.result;
    else
        return Promise.reject(value);
}

function _errorUnhandle(error) {
    var message = "网络错误";
    
    if(error.status && error.statusText)
        message = error.status+" : "+error.statusText;
    else if(error.statusText)
        message = error.status;
    else if(error.code!==void(0)&&error.msg)
        message = "错误代码 : "+error.code+"，"+error.msg;

    new XBox({
        message: message,
        type: "wraning",
        category: "message"
    }).show();

    if(utils.env.dev)
        throw error;
}

module.exports = {
    /**
     * options
     * @param   url      
     * @param   data     
     * @param   success 
     * @param   error     
     * @param   promise
     * @param   prePrase 预处理返回           
     */
    ajax: function(options) {
        options.prePrase = (options.prePrase === undefined) ? true : options.prePrase;
        options.error = options.error || _errorUnhandle;
        if (!!options.promise) {
            var successFuc = options.success;
            var errorFuc = options.error;
            return new Promise(function(resolve, reject) {
                    options.success = function(data) {
                        resolve(data);
                    };
                    options.error = function(error) {
                        reject(error);
                    };
                    $.ajax(options);
                })
                .then(jsonParse)
                .then(preParse.bind(null, options.prePrase))
                .then(successFuc)['catch'](errorFuc)
        } else {
            $.ajax(options);
        }
    }
}