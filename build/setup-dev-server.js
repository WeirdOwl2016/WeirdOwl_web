const fs = require('fs')
const path = require('path')
// const MFS = require('memory-fs')
const webpack = require('webpack')
// const chokidar = require('chokidar')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')
const deleteFolder = path => {
  var files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
// fs.writeFileSync(filepath, )
module.exports = function setupDevServer (app, cb) {
  let bundle = {}
  let client
  // let clientManifest = true

  // let ready
  // const readyPromise = new Promise(r => { ready = r })
  const update = () => {
    if (Object.keys(bundle) && client) {
      console.log('//////////////////////////////////////////////\n')
      cb(bundle)
      // ready()
    }
  }

  // modify client config to work with hot middleware
  // clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].[Hash].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  let portconfig = require(process.env.CONFIG_PATH)
  // let staticURL = portconfig.staticURL + clientConfig.output.publicPath
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: '/',
    noInfo: true
  })
  app.use(devMiddleware)
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    fs.writeFileSync('/test.json', JSON.stringify(stats))
    if (stats.errors.length) return
    const distPath = path.join(clientConfig.output.path, '../')
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath)
    }
    const viewPath = path.join(clientConfig.output.path, '..', 'views')
    if (!fs.existsSync(viewPath)) {
      fs.mkdirSync(viewPath)
    }
    stats.assets.map(file => {
      if (file.name.indexOf('.html') >= 0) {
        const classFile = file.name.split('views\\')[1].split('\\')
        let filePath = viewPath
        classFile.map(item => {
          filePath = path.join(filePath, item)
          if (item.indexOf('.html') >= 0) { // 文件
            fs.writeFileSync(filePath, devMiddleware.fileSystem.readFileSync(filePath, 'utf-8'))
          } else if (!fs.existsSync(filePath)) { // 文件夹
            fs.mkdirSync(filePath)
          }
        })
      }
    })
    client = true
    update()
  })

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))  
  // watch and update server renderer
  serverConfig.output.filename = '[name].[Hash].js'
  const serverCompiler = webpack(serverConfig)
  const devMiddlewareServer = require('webpack-dev-middleware')(serverCompiler, {
    publicPath: '/',
    noInfo: true
  })
  app.use(devMiddlewareServer)
  serverCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    try {
       // dist
      const distPath = path.join(serverConfig.output.path, '../')
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath)
      }
      // fs.stat(distPath, (err, stat) => {
      //   if (err || !stat.isDirectory()) {
      //     fs.mkdirSync(distPath)
      //   }
      // })
      // server
      const serverPrePath = serverConfig.output.path
      deleteFolder(serverPrePath)
      fs.mkdirSync(serverPrePath)
      stats.assets.map(file => { 
        const serverpath = path.join(serverConfig.output.path, file.name)
        fs.writeFileSync(serverpath, devMiddlewareServer.fileSystem.readFileSync(serverpath, 'utf-8'))
        if (serverpath.indexOf('.js.map') < 0) {
          bundle[file.name.split('.')[0]] = serverpath
        }
      })
      const serverpath = path.join(serverConfig.output.path, stats.assets[0].name)
      fs.writeFileSync(serverpath, devMiddlewareServer.fileSystem.readFileSync(serverpath, 'utf-8'))
      update()
    } catch (e) {
      console.log('dev-------------------------------\n', e)
    }
  })
  app.use(require('webpack-hot-middleware')(serverCompiler, { heartbeat: 5000 }))

  // return readyPromise
}
