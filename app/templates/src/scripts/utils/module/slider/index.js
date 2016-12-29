
/**
 * 实现滚动效果函数对象
 * @authors AndyPan (pye-mail@163.com)
 * @date    2016年8月1日11:18:50
 */

var Threads = require('../thread/index.js');

//滑动效果(依赖于Thread模块)
var MySlider = function (options) {
    /// <summary>
    /// 滑动效果
    /// </summary>
    /// <param name="options" type="JSON Object">函数对象所需参数对象集合</param>

    var that = this;

    //创建实体对象
    var SliderModel = function (model) {
        /// <summary>
        /// 滑动效果实体对象
        /// </summary>
        /// <param name="model" type="JSON Object">实体对象</param>

        var that = this;

        //容器对象
        that.container = $(model.container || document.body);
        //滚动项每一项的宽度
        that.itemWidth = model.itemWidth;
        //一次滚动多少个项
        that.switchCount = model.switchCount || 1;
        //是否自动播放
        that.isAutoPlay = model.isAutoPlay != undefined && model.isAutoPlay != null ? model.isAutoPlay : true;
        //滚动时间间隔(单位：毫秒 1000毫秒=1秒)
        that.timeout = model.timeout || 3000;
        //鼠标移入是否停止自动滚动
        that.isMouseOverStop = model.isMouseOverStop != undefined && model.isMouseOverStop != null ? model.isMouseOverStop : true;
        //是否无缝隙滚动(未扩展)
        that.isSeamlessSwitch = model.isSeamlessSwitch != undefined && model.isSeamlessSwitch != null ? model.isSeamlessSwitch : true;
        //CSS3动画Class
        that.transition = model.transition || 'transition-slider';
        //滚动区域
        that.switchContainer = model.switchContainer || '.J-slider';
        //滚动目标元素
        that.switchTarget = model.switchTarget || '.J-target-slider';
        //滚动目标元素Item
        that.switchTargetItem = model.switchTargetItem || '.J-slider-item';
        //向左切换触发按钮
        that.switchLeftButton = model.switchLeftButton || 'J-button-switchLeft';
        //向右切换触发按钮
        that.switchRightButton = model.switchRightButton || 'J-button-switchRight';
        //自定义事件
        that.customEvent = new Object();
    };

    //实例化实体对象
    var SliderModelInstance = new SliderModel(options || {});

    //初始化操作
    var install = function () {
        /// <summary>
        /// 控件初始化操作
        /// </summary>

        var container = SliderModelInstance.container,
            transition = SliderModelInstance.transition,
            timer = 20;

        var switchContainer = container.find(SliderModelInstance.switchContainer),
            switchTarget = container.find(SliderModelInstance.switchTarget),
            switchTargetItem = container.find(SliderModelInstance.switchTargetItem);

        //Item长度
        var itemLength = switchTargetItem.length;
        //Item宽度
        var itemWidth = SliderModelInstance.itemWidth || switchTargetItem[0].offsetWidth;
        //内容总宽度
        var contentWidth = itemLength * itemWidth;

        //设置内容宽度
        switchTarget.css('width', (contentWidth) + 'px').css('left', '0px');
        switchTargetItem.css('float', 'left');

        //复制一个滚动元素作为无缝切换效果
        //var cloneSwitchTarget = switchTarget.clone().css('margin-left', -contentWidth + 'px').attr('data-left', -contentWidth);
        var cloneSwitchTarget = switchTarget.clone().css('left', -contentWidth + 'px').attr('data-left', -contentWidth);
        switchTarget.before(cloneSwitchTarget);

        //自定义事件
        var customEvent = SliderModelInstance.customEvent;

        //点击事件
        container.click(function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            var $target = $(target);

            //响应自定义事件-点击事件
            if (customEvent) {
                var clickEvent = customEvent.onClick;
                if (clickEvent && typeof (clickEvent) == 'function') {
                    //返回当前点击目标元素对象
                    clickEvent.call(this, $target);
                }
            }

            if ($target.hasClass(SliderModelInstance.switchLeftButton)) {
                //点击左边按钮，向右滚动
                roll('right');
            }
            else if ($target.hasClass(SliderModelInstance.switchRightButton)) {
                //点击右边按钮，向左滚动
                roll('left');
            }
        });

        //滚动
        var roll = function (direction) {
            //滚动方向
            var sliderDirection = direction || (switchContainer.attr('data-sliderDirection') || 'left');
            //目标元素当前Left值
            var marginLeft = parseInt(switchTarget.removeClass(transition).attr('data-left') || 0),
                //克隆元素Left值
                cloneMarginLeft = parseInt(cloneSwitchTarget.removeClass(transition).attr('data-left') || 0);
            
            //滚动距离
            var scrollLeft = itemWidth * SliderModelInstance.switchCount;

            if (sliderDirection == 'left') {
                //向左滚动

                //当前剩余距离
                var distance = contentWidth + marginLeft - 2*scrollLeft;
                //当前剩余距离小于等于需要滚动的距离，将克隆元素移动到后面补齐
                if (distance <= scrollLeft) {
                    cloneMarginLeft = contentWidth + marginLeft;
                    setTimeout(function(){
                        cloneSwitchTarget.removeClass(transition).css('left', (cloneMarginLeft) + 'px').attr('data-left', cloneMarginLeft);
                    }, 0);
                }
                var cloneDistance = contentWidth + cloneMarginLeft - scrollLeft;
                if (cloneDistance <= scrollLeft) {
                    marginLeft = contentWidth + cloneMarginLeft;
                    setTimeout(function(){
                        switchTarget.removeClass(transition).css('left', (marginLeft) + 'px').attr('data-left', marginLeft);
                    }, 0);
                }

                setTimeout(function () {
                    var mLeft = marginLeft - scrollLeft,
                        cloneMLeft = cloneMarginLeft - scrollLeft;

                    switchTarget.addClass(transition).css('left', (mLeft) + 'px').attr('data-left', mLeft);
                    cloneSwitchTarget.addClass(transition).css('left', (cloneMLeft) + 'px').attr('data-left', cloneMLeft);
                }, timer);

                switchContainer.attr('data-sliderDirection', 'left');

                //响应自定义事件-向左滚动事件
                if (customEvent) {
                    var sliderLeftEvent = customEvent.onSliderLeft;
                    if (sliderLeftEvent && typeof (sliderLeftEvent) == 'function') {
                        //返回当前滚动元素对象
                        sliderLeftEvent.call(this, switchTarget);
                    }
                }
            }
            else if (sliderDirection == 'right') {
                //向右滚动

                //当前剩余距离
                var distance = marginLeft;
                //当前剩余距离小于等于需要滚动的距离，将克隆元素移动到后面补齐
                if (distance <= scrollLeft) {
                    cloneMarginLeft = marginLeft - contentWidth;
                    cloneSwitchTarget.css('left', (cloneMarginLeft) + 'px').attr('data-left', cloneMarginLeft);
                }
                
                else if (cloneMarginLeft <= scrollLeft) {
                    marginLeft = cloneMarginLeft - contentWidth;
                    switchTarget.css('left', (marginLeft) + 'px').attr('data-left', marginLeft);
                }

                setTimeout(function () {
                    var mLeft = marginLeft + scrollLeft,
                        cloneMLeft = cloneMarginLeft + scrollLeft;

                    switchTarget.addClass(transition).css('left', (mLeft) + 'px').attr('data-left', mLeft);
                    cloneSwitchTarget.addClass(transition).css('left', (cloneMLeft) + 'px').attr('data-left', cloneMLeft);
                }, timer);

                switchContainer.attr('data-sliderDirection', 'right');

                //响应自定义事件-向右滚动事件
                if (customEvent) {
                    var sliderRightEvent = customEvent.onSliderRight;
                    if (sliderRightEvent && typeof (sliderRightEvent) == 'function') {
                        //返回当前滚动元素对象
                        sliderRightEvent.call(this, switchTarget);
                    }
                }
            }

            //响应自定义事件-滚动事件
            if (customEvent) {
                var sliderEvent = customEvent.onSlider;
                if (sliderEvent && typeof (sliderEvent) == 'function') {
                    //返回当前滚动元素对象
                    sliderEvent.call(this, switchTarget);
                }
            }
        };
        /*var roll = function (direction) {
            //滚动方向
            var sliderDirection = direction || (container.attr('data-sliderDirection') || 'left');
            //目标元素当前Left值
            var marginLeft = parseInt(switchTarget.attr('data-left') || 0),
                //克隆元素Left值
                cloneMarginLeft = parseInt(cloneSwitchTarget.attr('data-left') || 0);

            //滚动距离
            var scrollLeft = itemWidth * SliderModelInstance.switchCount;

            if (sliderDirection == 'left') {
                //向左滚动
                var mLeft = marginLeft - scrollLeft,
                    cloneMLeft = cloneMarginLeft - scrollLeft;

                //console.log(((mLeft - scrollLeft)<=-contentWidth)+';'+mLeft +';'+ scrollLeft +';'+ (-contentWidth));

                if (mLeft - scrollLeft <= -contentWidth) {
                    cloneSwitchTarget.removeClass(SliderModelInstance.transition);
                    setTimeout(function(){
                        cloneSwitchTarget.css('left', (contentWidth + marginLeft)+'px');
                        cloneSwitchTarget.attr('data-left', contentWidth + marginLeft);
                        setTimeout(function(){ cloneSwitchTarget.addClass(SliderModelInstance.transition); }, 20);
                    }, 0);
                }
                else {
                    cloneSwitchTarget.css('left', (cloneMLeft)+'px');
                    cloneSwitchTarget.attr('data-left', cloneMLeft);
                }
                if (cloneMLeft - scrollLeft <= -contentWidth) {
                    switchTarget.removeClass(SliderModelInstance.transition);
                    setTimeout(function(){
                        switchTarget.css('left', (contentWidth + cloneMarginLeft)+'px');
                        switchTarget.attr('data-left', contentWidth + cloneMarginLeft);
                        setTimeout(function(){ switchTarget.addClass(SliderModelInstance.transition); }, 20);
                    }, 0);
                }
                else {
                    switchTarget.css('left', (mLeft)+'px');
                    switchTarget.attr('data-left', mLeft);
                }
                container.attr('data-sliderDirection', 'left');
            }
            else if (sliderDirection == 'right') {
                //向右滚动
                var mLeft = marginLeft + scrollLeft,
                    cloneMLeft = cloneMarginLeft + scrollLeft;

                switchTarget.css('left', (mLeft) + 'px').attr('data-left', mLeft);
                switchTarget.css('left', (cloneMLeft) + 'px').attr('data-left', cloneMLeft);

                if (mLeft == 0) {
                    cloneSwitchTarget.removeClass(SliderModelInstance.transition);
                    setTimeout(function(){
                        cloneSwitchTarget.css('left', (-cloneMLeft) + 'px').attr('data-left', -cloneMLeft);
                        setTimeout(function(){ cloneSwitchTarget.addClass(SliderModelInstance.transition); }, 20);
                    }, 0);
                }
                if (cloneMLeft == 0) {
                    switchTarget.removeClass(SliderModelInstance.transition);
                    setTimeout(function(){
                        switchTarget.css('left', (-contentWidth) + 'px').attr('data-left', -contentWidth);
                        setTimeout(function(){ switchTarget.addClass(SliderModelInstance.transition); }, 20);
                    }, 0);
                }

                container.attr('data-sliderDirection', 'right');
            }
        };*/

        //是否自动切换
        if (SliderModelInstance.isAutoPlay) {
            //引入时间线程对象
            //var sliderThread = Module.Use('Thread');
            //自动切换
            var thread = new Threads(roll, SliderModelInstance.timeout);
            thread.start();
            //是否鼠标移入停止切换
            if (SliderModelInstance.isMouseOverStop) {
                container.mouseover(thread.stop);
                container.mouseout(thread.start);
            }
        }
    };

    install();

    that.onClick = function (fun) {
        if (fun) {
            SliderModelInstance.customEvent['onClick'] = fun;
        }
        return that;
    };

    that.onSlider = function (fun) {
        if (fun) {
            SliderModelInstance.customEvent['onSlider'] = fun;
        }
        return that;
    };

    that.onSliderLeft = function (fun) {
        if (fun) {
            SliderModelInstance.customEvent['onSliderLeft'] = fun;
        }
        return that;
    };

    that.onSliderRight = function (fun) {
        if (fun) {
            SliderModelInstance.customEvent['onSliderRight'] = fun;
        }
        return that;
    };
};

//输出(接口)
module.exports = MySlider;