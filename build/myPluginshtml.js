/*
 * @Author: yueLanFengHua
 * @Date: 2018-10-10 16:58:54
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-26 17:50:15
 */
const HtmlWebpackPlugin = require('html-webpack-plugin') // 是生成html文件

// const CommonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin('common') // 把公共模块提取出来, 并取名为'common'(名字自起), webpack之后再out文件夹下生成common.js, 测试时记得引入提取出来的公共模块js文件
const myHtmlWebpackPlugin = require('./MyPlugin')
const fs = require('fs')
const path = require('path')
const tplPath = './src/web/views/pages' // html原地址
const outTplPath = '../views' // 输出的目的地址
const buildEntryPath = './build/entry' // entry配置地址
/**
 * 分析获得配置入口以及其他资源信息
 */
function getEntry () {
  let plugins = []
  const layoutsPath = path.join(tplPath, '..', 'layouts')
  const outlayoutsPath = path.join(outTplPath, 'layouts')
  const layoutFilesList = fs.readdirSync(layoutsPath)
  layoutFilesList.map(flie => {
    const OutFileName = path.join(outlayoutsPath, flie)
    plugins.push(new HtmlWebpackPlugin({
      template: 'html-withimg-loader!' + path.join(layoutsPath, flie),
      // template: 'html-withimg-loader!./src/web/tpl/index.html',
      filename: OutFileName,
      chunks: []
    }))
  })
  const partialsPath = path.join(tplPath, '..', 'partials')
  const outpartialsPath = path.join(outTplPath, 'partials')
  const partialsFilesList = fs.readdirSync(partialsPath)
  
  partialsFilesList.map(flie => {
    const OutFileName = path.join(outpartialsPath, flie)
    plugins.push(new HtmlWebpackPlugin({
      template: 'html-withimg-loader!' + path.join(partialsPath, flie),
      // template: 'html-withimg-loader!./src/web/tpl/index.html',
      filename: OutFileName,
      chunks: []
    }))
  })
  // 读取文件列表
  let configPathsFileList = fs.readdirSync(buildEntryPath)
  let entry = {}
  let trueThunks = {} // 用于后面处理额外的参数&资源
  configPathsFileList.map(_path => {
    if (_path === '.svn') { return false }
    try {
      const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'entry', _path), 'utf-8'))
      pages.map(item => {
        const _filepathArr = item.page.split('/')
        const _tmpEntry = {}
        const filename = _filepathArr[_filepathArr.length - 1]
        let thunks = ['conmmon'].concat(item.thunks || [])
        var checkDir = fs.existsSync(path.join(tplPath, item.page + '.js'))
        if (checkDir) {
          _tmpEntry[filename] = [tplPath + '/' + item.page + '.js']
          entry = Object.assign(entry, _tmpEntry)
          if (thunks.indexOf(filename) <= 0) {
            thunks.push(filename)
          }
        }
        const OutFileName = path.join(outTplPath, item.page + '.html')
        plugins.push(new HtmlWebpackPlugin({
          template: 'html-withimg-loader!' + path.join(tplPath, item.page + '.html'),
          // template: 'html-withimg-loader!./src/web/tpl/index.html',
          filename: OutFileName,
          chunks: thunks
        }))
        trueThunks[OutFileName] = thunks
      })
      // entry = Object.assign(entry, config.assets)
      // let views = config.views || []
      // views.map(_view => {
      //   let filename = path.join(outTplPath, _view.path)
      //   let thunks = ['conmmon'].concat(_view.thunks || [])
      //   plugins.push(new HtmlWebpackPlugin({
      //     template: 'html-withimg-loader!' + path.join(tplPath, _view.path),
      //     // template: 'html-withimg-loader!./src/web/tpl/index.html',
      //     filename: filename,
      //     thunks: thunks
      //   }))
      //   trueThunks[filename] = thunks
      // })
    } catch (e) {
      console.error(_path + 'is error!', e)
    }
  })
  plugins.push(new myHtmlWebpackPlugin({
    trueThunks: trueThunks
  }))
  return {
    entry: entry,
    plugins: plugins
  }
}
module.exports = getEntry()
