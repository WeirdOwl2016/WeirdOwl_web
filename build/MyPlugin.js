function MyPlugin (options) {
  this.options = options
}

MyPlugin.prototype.apply = function (compiler) {
  var trueThunks = this.options.trueThunks || []
  compiler.plugin('compilation', function (compilation, options) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      let _trueThunks = trueThunks[htmlPluginData.outputName] || []
      let goalLength = _trueThunks.length
      let goalJs = htmlPluginData.assets.js || []
      if (goalJs.length || goalLength) {
        let jsString = goalJs.join(';')
        // 如果即将插入的js和希望插入的js长度一致，说明没有额外需要处理的js
        if (goalJs.length === goalLength) {
          return false
        }
        // // 当长度不一致时，循环真实的需要插入的资源
        // // 取当前i值为插入点
        for (let i = 0; i < goalLength; i++) {
          if (jsString.indexOf(`{{staticURL}}/${_trueThunks[i]}.`) < 0) {
            let _path = `{{staticURL}}/${_trueThunks[i]}`
            goalJs.splice(i, 0, _path)
          }
          if (goalJs.length === goalLength) {
            break
          }
        }
      }
    })
    // 由于mini-css-extract-plugin插件是吧css插入到head标签中，暂时没有找到不自动插入head中的设置，所以在最终生成的html中处理一下
    compilation.plugin('html-webpack-plugin-after-html-processing', function (htmlPluginData, callback) {
      // console.log(htmlPluginData)
      htmlPluginData.html = htmlPluginData.html.replace('<head>', '').replace('</head>', '')
    })
  })
}

module.exports = MyPlugin
