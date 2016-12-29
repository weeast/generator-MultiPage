'use strict';

var path = require('path');
var Url = require('url');
var argv = require('yargs').argv;

var fs = require('fs');
var glob = require('glob');

var express = require('express');

var proxy = require('express-http-proxy');
// middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var env = require(path.join(__dirname, '../configs/environments/index'));
var pkg = require(env.inProject('package.json'));

var router = express.Router();

// 页面相关代理接口
require('./routes/index')(router);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(cookieParser());

// mock api
router.get('/checklogin', function(req, res, next) {
    var info = require('../mock/checklogin');
    res.json(info);
});

router.get('/towerStatus', function(req, res, next) {
    var info = require('../mock/towerStatus');
    res.json(info);
});

// 入口
router.get('/', function(req, res, next) {
    var enties = fs.readdirSync(env.inSrc('scripts/pages'));
    var components = [];
    var plugins = [];
    var widgets = [];
    var pages = [];

    //页面入口
    enties.forEach(function(entry) {
        pages.push(entry.replace(/\.js$/, ''));
    });

    //组件入口
    if (argv.comps) {
        var _instanceId = 0;
        var componentsDir = fs.readdirSync(env.inSrc('scripts/components'));//glob.sync(env.inSrc('scripts/components/**/__test__/index.js'));
        var pluginsDir = glob.sync(env.inSrc('scripts/plugins/**/__test__/index.js'));
        var widgetsDir = glob.sync(env.inSrc('scripts/widgets/**/__test__/index.js'));
        componentsDir.forEach(function(dirName) {
            if(fs.statSync(path.resolve(env.inSrc('scripts/components'),dirName)).isDirectory())
                components.push(dirName);
        })
        pluginsDir.forEach(function(filePath) {
            var pluginName = filePath.substring(filePath.search('\/[^\/]*\/__test__\/index.js') + 1, filePath.indexOf('\/__test__\/index.js'));
            plugins.push(pluginName);
        })
        widgetsDir.forEach(function(filePath) {
            var widgetName = filePath.substring(filePath.search('\/[^\/]*\/__test__\/index.js') + 1, filePath.indexOf('\/__test__\/index.js'));
            widgets.push(widgetName);
        })
    }
    
    //页面分类
    var group = {}
    if(argv.pages){
        group = {
            "demo-kind":{     
                "demo.html": "实列1",
                "demo-kind-list-2.html": "实列2",
            },
            "demo-kind-2":{
                "demo-kind-list-1.html": "实列1",
                "demo-kind-list-2.html": "实列2",
            }
        }
    }

    try{
        res.render('home', {
            group: group,
            pages: pages || [],
            components: components,
            plugins: plugins,
            widgets: widgets,
            title: pkg.name || ''
        });
    }catch(err){
        throw err
    }
});

// 入口
router.get('/dir/:dirname', function(req, res, next) {
    var dirname = req.params.dirname,
        components = [];

    var componentsDir = glob.sync(env.inSrc('scripts/components/'+dirname+'/**/__test__/index.js'));
    componentsDir.forEach(function(filePath) {
        var componentName = filePath.substring(filePath.search('\/[^\/]*\/__test__\/index.js') + 1, filePath.indexOf('\/__test__\/index.js'));
        components.push(componentName);
    })
    try{
        res.render('dir', {
            dir: dirname,
            components: components,
            title: pkg.name || ''
        });
    }catch(err){
        throw err
    }
    
});

module.exports = router;