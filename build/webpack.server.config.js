const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const isProd = process.env.NODE_ENV === 'production'
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
    }),
    new CleanWebpackPlugin(['dist/server'], {
      root: path.resolve(__dirname, '..'), // 根目录
      verbose: true, // 开启在控制台输出信息
      dry: false // 启用删除文件
    })
  ],
  devtool: isProd
  ? false
  : '#cheap-module-source-map'
}
