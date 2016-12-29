/**
 * 战队-比赛-即将开始
 * @authors AndyPan (pye-mail@163.com)
 * @date    2016-06-28 14:46:07
 */


//引用视图样式
require('./view.less');
//引用视图模板
var template = require('jade!./view.jade');
//引用基础模块
var base = require('base');

var constants = require('JS/constant')

//(注意)严格模式
"use strict";

var mock = {
    name: '-',
    time: '-',
    team1: {
        name: '-',
        icon: constants.defaults.teamIcon,
        data: '-',
        link: 'javascript:;'
    },
    team2: {
        name: '-',
        icon: constants.defaults.teamIcon,
        data: '-',
        link: 'javascript:;'
    }
};

//console.log(new Date('2016-07-04 09:00').getTime());

var defaults = {
    //容器
    container: null,
    //自定义主样式名称
    className: null,
    //自动渲染(组件默认自动渲染)
    isAutoRender: true,
    //在重复渲染同一组件时，是否移除已创建组件
    isRemoveBefore: true,
    //数据对象
    data: [mock],
    //数据键
    dataKey: null
};

/**
 * InProgress(模块)
 * @param  {Object} options配置参数对象
 * @return {Object} 对外接口方法
 */
var InProgress = function(options){

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
        var templateNode = template({
            //自定义主样式名称
            className: setting.className || '',
            //数据对象
            data: setting.data || [],
            //数据键
            dataKey: setting.dataKey || {}
        });
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
    var init = function(){
        //容器为必须参数，为保证控件逻辑正常执行，在使用者未(正确)提供控件容器时，默认以body作为容器
        setting.container = $(setting.container ? (setting.container.length ? setting.container : document.body) : document.body);
        
        if(setting.isAutoRender){
            //渲染模板
            fn.render(fn.bindEvent);
        }
    };
    
    //初始化组件
    init();

    self.render = function(data){
        setting.data = [data] || setting.data;
        fn.render(setting.data);
    }
};


//输出(接口)
module.exports = InProgress;