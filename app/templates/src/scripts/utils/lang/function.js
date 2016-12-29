/**
 * Function Util
 * @authors AndyPan (pye-mail@163.com)
 * @date    2016-08-25 14:50:03
 */

'use strict';

var BuiltIn={};BuiltIn.isJSON=function(t){return"object"==typeof t&&"[object object]"==Object.prototype.toString.call(t).toLowerCase()||!1},BuiltIn.isArray=function(t){return"object"==typeof t&&"[object array]"==Object.prototype.toString.call(t).toLowerCase()||!1},BuiltIn.ParameterManager=function(){var t=[],e=[],r={__length__:0};if(BuiltIn.isJSON(arguments[0][0])){var o=arguments[0][0],n=arguments[1].paramNames(),a=n.toJSON();for(var i in o)a[i]?a[i]=o[i]:(r[i]=o[i],r.__length__++);for(var i in a)e.push("__TEMP__"==a[i]?void 0:a[i]);t=[e,r.__length__?r:void 0]}else t=[arguments[0],r.__length__?r:void 0];return t},Array.prototype.toJSON=function(t,e){var r={},o="__TEMP__",n=this,a=0;return n.length&&("["+n.join("][")+"]").replace(/\[[^\]]+\]/g,function(n){n=n.replace("[","").replace("]",""),o=t?"function"==typeof t?t(n):"[object array]"===Object.prototype.toString.call(t).toLowerCase()?t[a]:t:o,e&&t?r[o]=n:e||(r[n]=o),a++}),r};

/**
 * 获取一个函数的所有参数名字
 * @return {Array} 参数名字数组集合
 */
Function.prototype.paramNames = function(){
	return this.toString()
			.split('\n')[0].match(/\([^\)]+\)/g).toString()
			.replace('(', '').replace(')', '')
			.replace(new RegExp(' ', "gm"), '').split(',');
};

/**
 * 如果一个函数有多个参数，其中部分参数又不是必须的，可以采用该方法对参数进行统一管理，只需传入一个JSON对象，
 * 以原函数的参数名作为JSON对象的key，传入必要的参数
 * @return {Object} 原函数的返回值
 */
Function.prototype.callee = function(){
	var result = BuiltIn.ParameterManager(arguments, this);
	return this.apply(arguments[1] || result[1], result[0]);
};

/**
 * 在面对设置一个键值对操作的时候，也许你会面临设置一个键值对集合，没关系，你不用去循环，该方法可以帮你完成
 * @param  {Array/JSON Object} objs 键值对集合对象
 * @return {Object}      原函数的返回值
 */
Function.prototype.kvpcallee = function(objs){
	var result, _self = this;
	if(objs){
		var each = function(obj){
			for(var key in obj)
				result = _self.apply(arguments[1] || {}, [key, obj[key]]);
		};
		if(BuiltIn.isArray(objs)){
			var i = 0, len = objs.length, item;
			for(;i<len;i++){
				item = objs[i];
				if(BuiltIn.isJSON(item))
					each(item);
			}
		}
		else if(BuiltIn.isJSON(objs))
			each(objs);
	}
	return result;
};

module.exports = {};

/**
 * Case：
 *
 * var testFn = function(arg1, arg2, arg3, arg4){
 * 	console.log(arg1+'---'+arg2+'---'+arg3+'---'+arg4);
 * };
 *
 * //可以打乱顺序，可以任意省略
 * testFn.callee({arg3: 3, arg4: 4, arg2: 2});
 */