/**
 * 测试
 * @authors AndyPan (pye-mail@163.com)
 * @date    2016-06-28 15:29:14
 */


require('LESS/common')

var comp = require('../index');

var mock = {
    name: '2016年马尼拉特锦赛中国区预选赛',
    time: '1467594000000',
    team1: {
        name: 'Newbee.Y',
        icon: 'http://placehold.it/40x40',
        data: '1:0.618'
    },
    team2: {
        name: 'Newbee.Y',
        icon: 'http://placehold.it/40x40',
        data: '1:0.618'
    }
}

new comp({
    container: '.container',
    data: [mock]
});


