/**
 * 时间相关方法
 * @authors weeast (weeast.cd@gmail.com)
 * @date    2016-07-29 15:38:45
 */

'use strict';

var defaults = {
    // 时间数字阈值（毫秒）[小时，天，周，月, 年]
    timeNumber: [3600000,86400000,604800000,2592000000,31536000000],
    // 时间数字阈值对应
    timeStr: ["小时","天","周","月","年"]
}

//补零
function _completionZero(num, digits) {
    num = num.toString();
    var zeros = digits - num.length;
    while (zeros > 0) {
        num = '0' + num;
        zeros--;
    }
    return num
}

//比赛时间格式MM:SS
function _matchFormat(time) {
    var min = parseInt(time / 60);
    var sec = parseInt(time % 60);
    min = _completionZero(min, 2);
    sec = _completionZero(sec, 2);
    return min + ":" + sec
}

/**
 * 计算距离现在多久
 * @param  {number} time    时间，毫秒级
 * @param  {number} maxUnit 最大时间单位[1-小时，2-天，3-周，4-月, 5-年]
 * @return {str}            距离现在多久
 */
function _howLong(time, maxUnit){
    maxUnit = maxUnit || 4; // 默认以月计量
    var res = "-",
        current = new Date().getTime(), // 现在
        duration = Math.abs(current-time) || 0; // 时间间隔

    if(!duration){
        console.err(new Error("时间无效"))
        return "-";
    }

    // 遍历时间阈值判断距离现在距离
    var i = 0;
    while(i<6){
        var nextTimeNum = defaults.timeNumber[i+1] || -1, // 下一个时间阈值
            curTimeNum = defaults.timeNumber[i], // 时间阈值
            curTimeStr = defaults.timeStr[i]; // 对应的时间

        i++;
        if(!curTimeNum) return res;
        if(duration>nextTimeNum && nextTimeNum !== -1 && i < maxUnit) continue; // 大于时间阈值则用下一个时间计量

        res = parseInt(duration/curTimeNum) || 1; //小于1则用1表示
        return res += curTimeStr;
    }
    return res;
}

module.exports = {
    //时间格式化
    format: function(time, type) {
        switch (type) {
            case 'match':
                if (time)
                    return _matchFormat(time);
                else
                    return "00:00"
            default:
                return time
                break;
        }
    },
    formatDate: function(date, type){
        if(type == 'yyyy-mm-dd') {
            var yy = date.getFullYear(),
                mm = date.getMonth()+1,
                dd = date.getDate();
            mm = mm < 10 ? '0'+mm : mm;
            dd = dd < 10 ? '0'+dd : dd;
            return yy+'-'+mm+'-'+dd
        }
    },
    // 距离现在时间
    howLong: _howLong
}