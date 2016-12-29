'use strict';

var assign = require('object-assign');
var argv = require('yargs').argv;

var webpack = require('webpack');
var glob = require('glob');

var extractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var env = require('../environments');

module.exports = function makeClientDevelopmentConfig(config) {
    var extractCSS = new extractTextPlugin('css/[name].css?[contenthash]');
    var cssLoader = extractCSS.extract(['css']);
    var lessLoader = extractCSS.extract(['css', 'less']);
    //组件或插件入口js
    var componentsEntries =(function() {
        var componentsDir = env.inSrc('scripts/components');
        var pluginsDir = env.inSrc('scripts/plugins');
        var components = glob.sync(componentsDir + '/**/__test__/index.js');
        var projPlugins = glob.sync(pluginsDir + '/**/__test__/index.js');
        var totalEntries = components.concat(projPlugins);
        var _instanceId = 0;
        var map = {};
        
        if(!argv.comps) {
            return map;
        }
        console.log("============================>已打开组件测试!")

        //组件或插件入口html
        totalEntries.forEach(function(filePath) {
            var HmtlConfig = {
                template: 'html!' + env.inSrc('tmpl/component-unit.html'),
                inject: 'body',
                chunks: ['vendor', 'commons'],
                chunksSortMode: function(a, b) {
                    if (a.names[0] == 'commons') return -1;
                    if (b.names[0] == 'commons') return 1;
                    if (a.names[0] == 'vendor') return -1;
                    if (b.names[0] == 'vendor') return 1;
                    return 1
                }
            };
            //获取组件或插件名
            var fileName = filePath.match(/\/[^\/]*\/__test__\/index.js$/);
            var outputPath = filePath.match(/components/) ? 'components' : 'plugins';
            if (fileName)
                fileName = fileName[0].replace(/[\/](__test__)*(index.js$)*/g, '');
            else
                fileName = 'chunks';
            //添加到webpack entry
            map[++_instanceId + '.test.' + fileName] = filePath;
            //添加到webpack html plugin配置
            HmtlConfig.filename = '__' + outputPath + '__/' + fileName + '.html';
            HmtlConfig.chunks.push(_instanceId + '.test.' + fileName);
            //添加到wepack plugin列表
            config.plugins.push(new HtmlWebpackPlugin(HmtlConfig));
        });

        return map;
    })()

    // 开发工具源路径映射
    config.devtool = "cheap-module-eval-source-map"
    config.debug = true;
    config.displayErrorDetails = true;
    config.outputPathinfo = true;

    config.entry = assign(config.entry, componentsEntries);

    // 热替换入口配置
    // 多入口文件的情况，每一个入口文件都必须加上这个配置
    // 参见 https://github.com/glenjamin/webpack-hot-middleware 
    for (var key in config.entry) {
        if (!Array.isArray(config.entry[key])) {
            config.entry[key] = [config.entry[key]];
        }
        config.entry[key].push('webpack-hot-middleware/client?reload=true');
    }

    config.output = {
        path: env.inDist('assets'),
        filename: '[name].js',
        chunkFilename: '[chunkhash:8].chunk.js',
        hotUpdateChunkFilename: '[id].js',
        publicPath: env.PUBLIC_PATH,
    };

    config.module.loaders.push({
        test: /\.css$/,
        loader: cssLoader
    }, {
        test: /\.less$/,
        loader: lessLoader
    });

    config.plugins.push(
        extractCSS,
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(), //热替换
        new webpack.NoErrorsPlugin()
    );

    return config;
};