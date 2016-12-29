const webpack = require('webpack');

const extractTextPlugin = require("extract-text-webpack-plugin");

const env = require('../environments');

module.exports = function makeClientDevelopmentConfig(config) {
    var extractCSS = new extractTextPlugin('css/[contenthash:8].[name].min.css');
    var cssLoader = extractCSS.extract(['css?minimize']);
    var lessLoader = extractCSS.extract(['css?minimize', 'less']);

    config.output = {
        path: env.inDist('assets'),
        filename: 'js/[chunkhash:8].[name].min.js',
        chunkFilename: 'js/[chunkhash:8].chunk.min.js',
        hotUpdateChunkFilename: 'js/[id].[chunkhash:8].min.js',
        publicPath: env.PUBLIC_PATH
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            mangle: {
                except: ['$', 'exports', 'require']
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    )

    return config;
}