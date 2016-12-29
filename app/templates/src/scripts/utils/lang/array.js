module.exports = {
    //数组中的位置
    in: function(ids, heroList) {
        if(ids===void(0)) return;

        heroList = heroList || [];

        var target = [];

        for(var index in heroList){
            var hero = heroList[index];

            for(var i in ids)
                if(ids[i] == hero.heroId) target[i] = index;
        }

        return target;
    }
}