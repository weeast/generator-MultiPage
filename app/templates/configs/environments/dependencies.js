module.exports = exports = {
  plugins: [],
  vendors: [
    'immutable/dist/immutable.js',
    'echarts/build/dist/echarts.js',
    'exports?promise!es6-promise/promise.js'
  ],
  aliases: {
    'apis': './src/scripts/apis',
    'components': './src/scripts/components',
  }
};