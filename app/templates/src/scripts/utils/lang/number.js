module.exports = {
    //保留小数部分
    getFloat: function(num, convert) {
        var numStr = num.toString(),
            numArr = numStr.split('.');
        if (numArr[1] && convert)
            return parseFloat('0.' + numArr[1])
        else if (numArr[1])
            return numArr[1]
        else
            return 0
    },
    //转换为百分数
    toPrecent: function(num, point) {
        point = point!==void(0)?point:2;
        var inter = parseInt(num) || '',
            flo = this.getFloat(num),
            res;
        if (flo && flo.length < 2)
            res = inter + flo + '0';
        else if (flo)
            res = inter + flo.slice(0, 2) + '.' + flo.slice(2, point + 2);
        else
            res = inter + '00';
        return parseFloat(res)
    },
    //K值化
    toKilo: function(num, point) {
        point = point || 2;
        num = parseFloat(num / 1000).toFixed(point);
        return parseFloat(num) + 'K';
    },
    //保留小数
    keepFloat: function(num, point){
        point = point || 2;
        num = parseFloat(num).toFixed(point);
        return parseFloat(num);
    }
}