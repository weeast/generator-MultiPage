/**
 * author: 潘毅
 * email: pye-mail@163.com
 * date: 2016-03-30 11:27:32
 * remark: 模块化基础类
 */

//(注意)严格模式
"use strict";

/**
 * BaseModule(模块)
 * @param  {Object} setting配置参数对象
 * @param  {Object} 子作用域中可访问的私有方法对象
 * @return {Object} 对外接口方法(可通过原型，实现自定义公共方法)
 */
var BaseModule = function(setting, childScope) {

	var self = this;

	//事件委托对象
	childScope.Delegates = {};
	//存储自定义委托对象
	var customDelegates = {};

	/**
	 * 添加自定义事件
	 * @param  {String} name 事件名称
	 * @param  {Function} handler 事件函数
	 * @return {Object} 当前实例对象
	 */
	childScope.Delegates.on = function(name, handler) {
		name = name ? name.toLocaleUpperCase() : null;
		if (name && handler)
			customDelegates['on'+name] = [handler];

		return self;
	};

	/**
	 * 绑定自定义事件
	 * @param  {String} name 事件名称
	 * @param  {Function} handler 事件函数
	 * @return {Object} 当前实例对象
	 */
	childScope.Delegates.bind = function(name, handler) {
		name = name ? name.toLocaleUpperCase() : null;
		if (name && handler){
			var key = 'on'+name;
			customDelegates[key] = customDelegates[key] || [];
			customDelegates[key].push(handler);
		}

		return self;
	};

	/**
	 * 触发(执行或响应)已绑定的自定义事件
	 * @param  {String} name 事件名称
	 * @param  {Array} args 需要传递给事件函数的参数集合
	 * @param  {object} posing 以对象冒充的方式替换事件函数this
	 * @return {Object} 事件返回值或当前实例对象
	 */

	childScope.Delegates.fire = function(name, args, posing, async) {
		name = name ? name.toLocaleUpperCase() : null;
		var handlerResult;
		var handler = function(){
			var handlers = customDelegates['on' + name];
			if(handlers){
				var i = 0, len = handlers.length, result;
				for(; i < len; i++){
					result = handlers[i].apply(posing || setting.templateNode || self, args || []);
					if(result != undefined)
						handlerResult = result;
				}
			}
		};
		if(async == false)
			handler();
		else
			setTimeout(handler, 0);

		return handlerResult;
	};

	/**
	 * 移除事件监听
	 * @param  {String} name 事件名称
	 * @param  {Function} handler 事件操作函数
	 * @return {Object} 当前实例对象
	 */
	childScope.Delegates.shift = function(name, handler) {
		name = name ? name.toLocaleUpperCase() : null;
		if(name && handler) {
			var key = 'on' + name;
			var handlers = customDelegates[key];
			if(handlers){
				var i = 0, len = handlers.length;
				for(; i< len; i++){
					if(handler == handlers[i]){
						customDelegates[key].splice(i, 1);
						break;
					}
				}
			}
		}
		else if(name && !handler)
			customDelegates['on' + name] = undefined;
		else if(!name && !handler)
			customDelegates = {};

		return self;
	};

	/**
	 * (手动执行)渲染
	 * @param {Function} callBack 渲染回调函数
	 */
	self.render = function(callBack) {
		//渲染模板
		childScope.render(function(node) {
			childScope.bindEvent();
			if (callBack && typeof(callBack) == 'function')
				callBack.call(node);
		});
		return self;
	};

	/**
	 * 添加组件事件委托(相同name的事件只允许一个存在)
	 * @param  {String} name 委托事件名称
	 * @param  {Function} handler 事件操作函数
	 * @return {Object} 当前实例对象
	 * @remark 相同name的事件只允许一个存在，使用on添加事件会替换原有的使用on绑定的同名事件，并且也会替换使用bind绑定的同名事件
	 */
	self.on = function(name, handler) {
		if (handler) {
			//委托事件
			childScope.Delegates.on(name, handler);
		} else {
			//触发事件
			childScope.Delegates.fire(name, null, setting.templateNode);
		}

		return self;
	};

	/**
	 * 绑定组件事件委托(相同name的事件允许多个存在)
	 * @param  {[type]} name    委托事件名称
	 * @param  {[type]} handler 事件操作函数
	 * @return {[type]}         当前实例对象
	 * @remark 相同name的事件允许多个存在，使用bind绑定的事件不会替换on绑定的同名事件，也不会替换bind绑定的同名事件，允许同名事件有多个操作
	 */
	self.bind = function(name, handler){
		if(handler)
			//委托事件
			childScope.Delegates.bind(name, handler);

		return self;
	};

	/**
	 * 移除事件监听
	 * @param  {String} name 事件名称
	 * @param  {Function} handler 事件操作函数
	 * @return {Object} 当前实例对象
	 */
	self.shift = function(name, handler) {
		return childScope.Delegates.shift(name, handler);
	};

	/**
	 * 设置setting属性
	 * @param {Object} obj 需要设置的属性对象
	 */
	self.set = function(obj){
		if(obj){
			for(var key in obj)
				setting[key] = obj[key];
		}
		return self;
	};
};


//输出(接口)
module.exports = BaseModule;