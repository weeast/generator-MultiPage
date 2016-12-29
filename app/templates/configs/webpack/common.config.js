'use strict';

var assign = require('object-assign');
var path = require('path');
var argv = require('yargs').argv;

var webpack = require('webpack');
var glob = require('glob');

var extractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var commonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var env = require('../environments');

function getEntries() {
    var entryDir = env.inSrc('scripts/pages');
    var entryFiles = glob.sync(entryDir + '/*.js');
    /****************************/
    /*var map = {"IframeOnLive":env.inSrc("scripts/pages/IframeOnLive.js"),
                "iframeSchedule":env.inSrc("scripts/components/IframeLive/IfameBeforeLive/IframeSlider/__test__/index.js"),
                "IframeAfterLive":env.inSrc("scripts/pages/IframeAfterLive.js")};*/

                /****************************/
    //遍历入口文件
    var map = {};
    if(!argv.pages){
        return map
    }
    entryFiles.forEach(function(filePath) {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    });
 /****************************/
    
    console.log("============================>已打开页面测试!")
    return map;
}


function makeDefaultConfig() {
    var entries = getEntries();
    // html webpack plugin
    // generate entry html files
    // 自动生成入口文件，入口js名必须和入口文件名相同
    var plugins = (function() {
        var srcPath = env.inSrc();
        var entryHtml = glob.sync(srcPath + '/*.html');
        var res = [];

        entryHtml.forEach(function(filePath) {
            var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
            var conf = {
                template: 'html!' + filePath,
                filename: filename + '.html',
                chunksSortMode: function(a, b) {
                    if (a.names[0] == 'commons') return -1;
                    if (b.names[0] == 'commons') return 1;
                    if (a.names[0] == 'vendor') return -1;
                    if (b.names[0] == 'vendor') return 1;
                    return 1
                }
            }

            if (filename in entries) {
                conf.inject = 'body'
                conf.chunks = ['vendor', 'commons', filename]
                res.push(new HtmlWebpackPlugin(conf));
            }


        })
        /****************************/
        /*res.push(new HtmlWebpackPlugin({
            template: 'html!'+env.inSrc("tmpl/component-unit.html"),
            filename: 'iframeSchedule.html',
            inject: 'body',
            chunks: ['vendor', 'commons', 'iframeSchedule'],
            chunksSortMode: function(a, b) {
                if (a.names[0] == 'commons') return -1;
                if (b.names[0] == 'commons') return 1;
                if (a.names[0] == 'vendor') return -1;
                if (b.names[0] == 'vendor') return 1;
                return 1
            }
        }));*/
        /****************************/
        return res;
    })();

    return {
        entry: assign(entries, {
            //公共库
            'vendor': ['jquery']
        }),
        output: {
            /*path: path.join(env.PROJECT_PATH, env.DIR_DIST),
            filename: 'js/[name].js', //[hash] [chunkhash]
            chunkFilename: "js/[name].chunk.js"*/
        },
        module: {
            //preLoaders:[],
            loaders: [{
                    test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                    loaders: [
                        // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                        // 否则则调用file-loader，参数直接传入
                        'url?limit=10&name=img/[hash:8].[name].[ext]',
                        'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                    ]
                }, {
                    test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                    loader: 'url?limit=10&name=fonts/[hash:8].[name].[ext]'
                }
                /*,{
                                test: /\.css$/,
                                loader: extractTextPlugin.extract("style-loader", "css-loader")
                            }, {
                                test: /\.less$/,
                                loader: extractTextPlugin.extract("style-loader", "css-loader", "less-loader")
                            }*/
            ]
        },
        plugins: plugins.concat([
            new webpack.ProvidePlugin({
                $: "jquery"
            }), // 所有模块 require('jquery')
            // new extractTextPlugin('css/[name].css',{disable:false}), //样式文件独立合并
            new commonsChunkPlugin({
                name: 'commons',
                filename: 'js/[hash:8].commons.min.js',
                minChunk: 3
            })

        ]),
        /*externals: {
            'jquery': 'jQuery'
        },*/
        resolve: {
            root: [
                env.inSrc('js/vendor')
            ],
            alias: assign({
                'jquery': env.inNodeMod('jquery/dist/jquery.js'),
                'JS': env.inSrc('scripts'),
                'base': env.inSrc('scripts/utils/module/base/index'),
                'CSS': env.inSrc('css'),
                'IMG': env.inSrc('images'),
                'LESS': env.inSrc('less'),
                'WIDGETS': env.inSrc('scripts/widgets')
            }, env.ALIAS),
            extensions: ['', '.js', '.css', '.less', '.jade', '.png', '.jpg']
        },

        resolveLoader: {
            root: env.inNodeMod()
        },
        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: '/',
            stats: {
                cached: false,
                colors: true
            }
        }
    }
}

module.exports = function makeConfig(configModifier) {
    return assign({}, makeDefaultConfig(), configModifier);
};