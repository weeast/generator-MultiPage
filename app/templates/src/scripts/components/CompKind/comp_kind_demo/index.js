/**
 * 战队简介
 * @authors weeast (weeast.cd@gmail.com)
 * @date    2016-06-28 10:24:34
 */


//引用视图样式
require('./view.less');
//引用视图模板
var template = require('jade!./view.jade');
//引用基础模块
var base = require('base');

//(注意)严格模式
"use strict";

var mock = {
    icon: 'http://placehold.it/64x64',
    name: 'Team Liquid',
    group: '职业组',
    rank: 3,
    score: 1234,
    winRate: '61.34%',
    totalComps: 1354,
    win: 123,
    flat: 12,
    lose: 999
}

var defaults = {
    //容器
    container: null,
    //自定义主样式名称
    className: null,
    //自动渲染(组件默认自动渲染)
    isAutoRender: true,
    //在重复渲染同一组件时，是否移除已创建组件
    isRemoveBefore: true,
    datas: mock
};

/**
 * TeamIntro(模块)
 * @param  {Object} options配置参数对象
 * @return {Object} 对外接口方法
 */
var TeamIntro = function(options){

    var self = this;

    //默认参数与自定义参数合并后的参数对象
    var setting = $.extend(true, {}, defaults, options || {}),
        //私有函数对象
        fn = {};

    //(对象冒充方式)继承基础模块
    base.call(self, setting, fn);

    /**
     * 渲染，用于对组件视图模板的(数据)渲染操作
     */
    fn.render = function(callBack){
        //二次渲染时，移除(当前)已渲染的模板节点
        if(setting.templateNode && setting.isRemoveBefore)
            setting.templateNode.remove();
        //生成模板
        var templateNode = template($.extend({
            //自定义主样式名称
            className: setting.className || ''
        },setting.datas));
        //保存模板元素节点
        setting.templateNode = $(templateNode);
        //添加到指定容器
        setting.container.append(setting.templateNode);
        //渲染回调
        if(callBack && typeof(callBack) == 'function')
            callBack.call(setting.templateNode);
        //响应(自定义)渲染事件(参数：事件名称，提供外部参数集合，提供外部函数的this对象)
        fn.Delegates.fire('render', null, setting.templateNode);
    };

    /**
     * 绑定事件
     */
    fn.bindEvent = function(){};

    /**
     * 初始化，提供给使用者自行调用，控件可能会在初始化之前绑定事件监听等操作，在绑定事件监听后再进行初始化
     */
    fn.init = function(){
        //容器为必须参数，为保证控件逻辑正常执行，在使用者未(正确)提供控件容器时，默认以body作为容器
        setting.container = $(setting.container ? (setting.container.length ? setting.container : document.body) : document.body);
        
        if(setting.isAutoRender){
            //渲染模板
            fn.render(fn.bindEvent);
        }
    };
    
    //初始化组件
    fn.init();
};


//输出(接口)
module.exports = TeamIntro;