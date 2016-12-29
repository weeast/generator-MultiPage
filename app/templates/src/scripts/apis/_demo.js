/**
 * 比demo接口
 * @authors dengjie (dengjie@stargame.com)
 * @date    2016-08-19 16:29:29
 */

'use strict';

var network = require('JS/utils/network');
var seed = require('JS/utils/index');

exports.demo = {
    // 赛前分析-战队近况
    _demo: function(){
        return network.ajax({
            url: seed.env.apisPath + '/_demo',
            type: 'get',
            promise: true,
            //prePrase: false
        })
    }
};