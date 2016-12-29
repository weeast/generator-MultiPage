/**
 * demo相关接口
 * @authors weeast (weeast.cd@gmail.com)
 * @date    2016-08-11 11:08:07
 */

'use strict';

var path = require('path');
var proxy = require('express-http-proxy');
var env = require(path.join(__dirname, '../../configs/environments/index'));

// proxy api url array
var proxyAry = [
    {url: '/demo', handle: null}
];


module.exports = function(router){

    var i = 0, len = proxyAry.length, item;
    for(;i<len;i++){
        item = proxyAry[i];
        router.get(item.url, proxy(env.PROXY_ADDR,{
            forwardPath: function(req, res) {
                if(item.handle)
                    item.handle(req, res);
                console.log(req.url);
                return '/web/dota2'+req.url;
            }
        }));
    }
    
};