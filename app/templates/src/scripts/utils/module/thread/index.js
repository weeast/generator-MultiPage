﻿/**
 *
 * 模拟线程
 *
 * version 1.0.2.0(主版本号.子版本号.编译版本号.修正版本号)
 *
 * @author pye-mail@163.com
 *
 * create log 2014年7月14日14:12:44
 *
 * update log 2014年7月15日09:58:46
 *
 */

var MyThread = function (fun, timer) {

    var that = this;

    var startThread, timingStartThread, timingStopThread, suspendThread;

    var ThreadModel = function (fun, timer) {
        var that = this;
        that.fun = fun;
        that.timer = timer;
    };

    var clearAllThread = function () {
        //清空启动中定时启动的线程
        window.clearTimeout(timingStartThread),
        timingStartThread = null;
        //清空start线程
        window.clearInterval(startThread),
        startThread = null;
        //清空暂停中的线程
        window.clearTimeout(suspendThread),
        suspendThread = null;
        //清空定时停止线程
        window.clearTimeout(timingStopThread),
        timingStopThread = null;
    };

    var ThreadModelInstance = new ThreadModel(fun, timer);

    //启动线程
    that.start = function (timer) {
        /// <summary>
        /// 启动线程
        /// </summary>
        /// <param name='timer' type='Int'>启动线程的时间，即多少毫秒后启动，默认(不填时)为立即启动(单位：毫秒[1000毫秒 = 1秒])</param>

        var that = this;

        timer = timer || 0;
        timingStartThread = window.setTimeout(function () {
            clearAllThread();
            //启动模拟线程
            startThread = window.setInterval(ThreadModelInstance.fun, ThreadModelInstance.timer);
        }, timer);
    };

    //停止线程
    that.stop = function (timer) {
        /// <summary>
        /// 停止线程
        /// </summary>
        /// <param name='timer' type='Int'>停止线程的时间，即多少毫秒后停止，默认(不填时)为立即停止(单位：毫秒[1000毫秒 = 1秒])</param>

        var that = this;

        timer = timer || 0;
        timingStopThread = window.setTimeout(function () {
            clearAllThread();
        }, timer);
    };

    //暂停线程
    that.suspend = function (timer) {
        /// <summary>
        /// 暂停线程
        /// </summary>
        /// <param name='timer' type='Int'>暂停线程的时间，即多少毫秒后继续执行，默认(不填时)为1000(单位：毫秒[1000毫秒 = 1秒])</param>

        var that = this;

        timer = timer || 1000;
        var againStart = that.start;
        clearAllThread();
        suspendThread = window.setTimeout(againStart, timer);
    };
};

//输出(接口)
module.exports = MyThread;