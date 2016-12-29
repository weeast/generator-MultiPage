/**
 * 404 页面
 * @authors dengjie (dengjie@stargame.com)
 * @date    2016-08-11 11:08:23
 */


'use strict';

require('LESS/common');

(function(){

	//预先require组件(在组件集[commonsComp]中，多个地方引用用一个组件时，将该组件提为一个公共组件，预先加载)
	var comps = (function(){
		var result = {};
		return result;
	})();

	//组件集
	var commonsComp = {
		//页面基础
		pagebase: require('JS/components/comp_demo')
	};

	//组件对应添加到的容器
	var container = {
		pagebase: '.J-wrapper'
	};

	//组件所需数据源
	var dataSource = {
		pagebase: null
	};

	//组件对应参数集合
	var params = {
		pagebase: null
	};

	//组件实例
	var compsInstance = {};

	//已渲染组件
	var rendered = {};

	var renderComps = function(compsObj, callBack){
		var pageRegion = $('.J-page-region');
		//遍历组件
		for(var key in compsObj){
			if(compsObj[key]){
	            var result = {};
	            result.container = container[key] ? pageRegion.find(container[key]) : $(document.body);
	            if(!result.container.length)
	                continue;
				compsInstance[key] = new compsObj[key]((function(key){
					if(dataSource[key])
						result.data = dataSource[key];
					if(params[key]){
						for(var p in params[key]){
							result[p] = params[key][p];
						}
					}
					return result;
				})(key));
			}
		}

		if(callBack)
			callBack();
	};

	var init = function(){
		//渲染基础组件
		renderComps(commonsComp);
	};

	init();
})();

