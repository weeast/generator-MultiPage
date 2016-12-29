var _instanceId = 0;

function _getUrl(){
    return location.href;
}

function _getParms(url){
    url = (url && new URL(url)) || location;
    var parms = url.search.replace(/\?/,''),
    obj = {};
    parms = parms.split('\&');
    for(var item in parms){
        if(parms[item]){
            var temp = parms[item].split('=');
            obj[temp[0]] = temp[1]
        }
    }
    return obj
}

module.exports={
    getParm: function(key, url){
        var parms = _getParms(url);
        if(parms)
            return parms[key];
        else
            return;
    },
    getAllParm: function(url){
        return _getParms(url);
    },
    getPath: function(url){
        var path = location.pathname.split('/');
        path[0] = location.host;
        return path;
    }
}