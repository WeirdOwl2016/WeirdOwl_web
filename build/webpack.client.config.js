const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HappyPack = require('happypack')
const os = require('os') // 获取电脑的处理器有几个核心，作为配置传入
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const ProgressBarPlugin = require('progress-bar-webpack-plugin') // 打包编译时显示进度条
// const providePlugin = new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery'}) // 引入jquery
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer')
// 自定义插件
const myPluginshtml = require('./myPluginshtml')
const path = require('path')
var cssLoader = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      // 使用postcss时候必须要有选项，并且选项中必须有内容
      // 否则会报错：No Postcss config found.
      // 具体配置和选项参考：https://github.com/michael-ciniawsky/postcss-load-config
      loader: 'postcss-loader',
      // 配置也可以通过 postcss.config.js 指定
      options: {
        plugins: (loader) => [
          require('autoprefixer')()
        ]
      }
    }
    // 'sass-loader'
  ],
  exclude: /node_modules/
}
// url-loader中设置的limit大小来对图片进行处理，小于limit的图片转化成base64格式，其余的不做操作。对于比较大的图片我们可以用image-webpack-loader 来压缩图片
var imgLoader = {
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1000,
        name: 'images/[name].[hash:7].[ext]'
        // name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    },
    {
      loader: 'image-webpack-loader', // 压缩图片
      options: {
        bypassOnDebug: true
      }
    }
  ],
  exclude: /node_modules/
}
module.exports = {
  mode: 'development', // development  production
  entry: myPluginshtml.entry,
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '{{staticURL}}/',
    path: path.resolve(__dirname, '../dist/assets')
  },
  module: {
    rules: [
      { test: /.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      cssLoader,
      imgLoader
    ]
  },
  // postcss:[autoprefixer({browsers:['last 2 versions']})],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // new HappyPack({ // 开启多线程打包
    //   id: 'happy-babel-js',
    //   loaders: ['babel-loader?cacheDirectory=true'],
    //   threadPool: happyThreadPool
    // }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true }
    }),
    // new ProgressBarPlugin({
    //   // format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
    //   // clear: false
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[chunkhash].css'
      // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../src/web/assets/js/plugins'), to: 'plugins', force: true }
    ], { debug: 'info', copyUnmodified: true })
  ].concat(myPluginshtml.plugins),
  // .concat([new CleanWebpackPlugin(['dist'], {
  //   root: path.resolve(__dirname, '..'), // 根目录
  //   verbose: true, // 开启在控制台输出信息
  //   dry: false // 启用删除文件
  // })]),
  devtool: 'eval-source-map',
  // devServer: {
  //   contentBase: path.join(__dirname, '../dist'), // 静态文件根目录
  //   port: 3824, // 端口
  //   host: 'localhost',
  //   hot: true,
  //   overlay: true,
  //   compress: false // 服务器返回浏览器的时候是否启动gzip压缩
  // },
  // watch: true, // 开启监听文件更改，自动刷新
  // watchOptions: {
  //   ignored: /node_modules/, // 忽略不用监听变更的目录
  //   aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
  //   poll: 1000 // 每秒询问的文件变更的次数
  // }
}
