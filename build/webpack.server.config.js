const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
// 自定义插件
const isProd = process.env.NODE_ENV === 'production'
// url-loader中设置的limit大小来对图片进行处理，小于limit的图片转化成base64格式，其余的不做操作。对于比较大的图片我们可以用image-webpack-loader 来压缩图片
module.exports = {
  mode: 'development', // development  production
  entry: {
    base: './src/server/base/index.js',
    controllers: './src/server/controllers/index.js',
    apis: './src/server/api/index.js'
  },
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist/server'),
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|css|pdf)$/,
        loader: 'ignore-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.CONFIG_PATH': JSON.stringify(process.env.CONFIG_PATH || '')
    })
    // new CleanWebpackPlugin(['dist/server'], {
    //   root: path.resolve(__dirname, '..'), // 根目录
    //   verbose: true, // 开启在控制台输出信息
    //   dry: false // 启用删除文件
    // })
  ],
  devtool: isProd
  ? false
  : '#cheap-module-source-map'
  // watch: true, // 开启监听文件更改，自动刷新
  // watchOptions: {
  //   ignored: /node_modules/, // 忽略不用监听变更的目录
  //   aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
  //   poll: 1000 // 每秒询问的文件变更的次数
  // }
}
