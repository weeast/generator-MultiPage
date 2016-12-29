/**
 * 描述
 * @authors AndyPan (pye-mail@163.com)
 * @date    2016-08-12 17:47:20
 */


'use strict';

module.exports = {
	placeholder: '-',
    placeholderNum: 0,
    //数据列表请求返回的对象模板，当请求返回为空时，为保证前端对数据的遍历和展示，采用统一的空结构
    reqTempList: {currPage: 1,list: [],size: 10,totalPage: 1},
	popup: {
		loading: '正在加载数据...',
        warning: '警告提示[暂未定义内容]',
        error: '操作失败！',
        success: '操作成功！',
        //请求失败提示
        reqError: '请求出错！',
        reqSuccess: '请求成功！',
        noData: '数据为空！'
	},
    defaults:{
        icon: 'http://placehold.it/44x44',
        heroIcon: 'http://placehold.it/64x44',
        heroBaseIcon: 'http://placehold.it/140x80',
        playerRecordHeroIcon: 'http://placehold.it/100x80',
        playerIcon: 'http://placehold.it/44x44',
        teamIcon: 'http://placehold.it/44x44',
        equipIcon: 'http://placehold.it/22x18',
        skillIcon: 'http://placehold.it/32x32',
        areaIcon: 'http://placehold.it/24x16',
        matchIcon: 'http://placehold.it/110x70'
    }
};