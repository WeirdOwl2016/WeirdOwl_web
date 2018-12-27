/*
 * @Author: yueLanFengHua
 * @Date: 2018-06-20 16:01:54
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-27 12:49:04
 * @version:1.1.0
 */
const isProd = process.env.NODE_ENV === 'production'
module.exports = function () {
  const express = require('express')
  const http = require('http')
  const app = express()
  const path = require('path')
  const handlebars = require('express-handlebars')
  const appsec = require('lusca')
  const bodyParser = require('body-parser')
  const cookieParser = require('cookie-parser')
  const compression = require('compression')
  const favicon = require('serve-favicon')
  const config = require(process.env.CONFIG_PATH)
  const serverInfo = `express/${require('express/package.json').version} `
  const {logErr, logInfo} = require('./src/server/log4')
  // 全局path
  process.env.ROOT = __dirname
  const resolve = file => path.resolve(__dirname, file)
  const serve = (path, cache) => express.static(resolve(path))
  app.use(bodyParser.json({limit: '50mb'}))
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  app.use(cookieParser())
  app.use(compression({ threshold: 0 }))
  app.disable('x-powered-by')
  const hdbs = handlebars.create({
    extname: '.html',
    defaultLayout: path.join(__dirname, 'dist/views/layouts/main')
  })
  app.engine('.html', hdbs.engine)
  app.set('views', path.join(__dirname, 'dist/views'))
  app.set('view engine', 'html')
  app.set('view cache', isProd)
  // csrf，p3p,xframe,csp
  app.use(appsec({
    // csrf: true,
    csp: {policy: {'object-src': '*', 'media-src': '*', 'frame-src': '*'}},
    xframe: 'SAMEORIGIN',
    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    p3p: 'ABCDEF',
    xssProtection: true,
    nosniff: true
  }))
  // 静态资源
  app.use('/', serve('./dist/assets', true))
  app.use(favicon(path.join(__dirname, '/public/logo-48.ico')))

  app.use((req, res, next) => {
    res.locals = {}
    res.startTime = new Date()
    next()
  })
  // let readyPromise
  let middlewareServer = {}
  const extend = (path) => {
    middlewareServer = {
      ...require(isProd ? `${path}base` : path.base),
      ...require(isProd ? `${path}apis` : path.apis),
      controllers: require(isProd ? `${path}controllers` : path.controllers),
      oldApis: {...middlewareServer.oldApis}
    }
    app.use(middlewareServer.resExtends)
    app.use(middlewareServer.reqExtends)
    // middlewareServer.request(app)
    middlewareServer.apisArry.map(url => {
      const reqType = url.requireType
      // 如果已生成过，则不处理
      if (middlewareServer.oldApis[url.url]) {
        return null
      }
      middlewareServer.oldApis[url.url] = true
      if (reqType === 'GET' || reqType === 'ALL') {
        app.get(url.url, (req, res) => {
          !isProd && middlewareServer.resExtends(req, res)
          !isProd && middlewareServer.reqExtends(req, res)
          middlewareServer.get(req, res, url.url)
        })
      }
      if (reqType === 'POST' || reqType === 'ALL') {
        app.post(url.url, (req, res) => {
          !isProd && middlewareServer.resExtends(req, res)
          !isProd && middlewareServer.reqExtends(req, res)
          middlewareServer.post(req, res, url.url)
        })
      }
    })
  }
  if (isProd) {
    extend('./dist/server')
    app.use((req, res, next) => {
      // res.render500(typeof err === 'string' ? err : JSON.stringify(err))
      console.error('500')
      res.status(500).send('404')
    })
    app.use((err, req, res, next) => {
      // res.render500(typeof err === 'string' ? err : JSON.stringify(err))
      console.error('500', err)
      res.status(500).send('500')
    })
  } else {
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle.
    require('./build/setup-dev-server')(
      app,
      (bundle) => {
        try {
          extend(bundle)
        } catch (e) {
          console.error(e)
        }       
      }
    )
  }
  // const render = (req, res) => {
  //   console.log('get')
  //   res.setHeader('Content-Type', 'text/html')
  //   res.setHeader('Server', serverInfo)
  //   res.status(200).send('test')
  // }
  // app.get('/we', (req, res) => {
  //   res.send('12414')
  // })
  // app.get('/we', (req, res) => {
  //   res.send('ettwtewtw')
  // })
  // app.get('*', isProd ? render : (req, res) => {
  //   console.log('start get', req.url)
  //   readyPromise.then(() => {
  //     console.log('start')
  //     // 处理资源
  //     middlewareServer.get(req, res, (html = {}) => {
  //       res.setHeader('Content-Type', html.contentType || 'text/html')
  //       res.setHeader('Server', serverInfo)
  //       res.status(200).send(html.content)
  //     })
  //   })
  // })

  // app.post('*', isProd ? render : (req, res) => {
  //   readyPromise.then(() => {
  //     // 处理资源
  //     middlewareServer.post(req, res, (data = {}) => {
  //       res.send(data)
  //     })
  //   })
  // })
  // app.use((req, res, next) => {
  //   // res.render500(typeof err === 'string' ? err : JSON.stringify(err))
  //   console.error('500')
  //   res.status(500).send('404')
  // })
  // app.use((err, req, res, next) => {
  //   // res.render500(typeof err === 'string' ? err : JSON.stringify(err))
  //   console.error('500', err)
  //   res.status(500).send('500')
  // })

  process.on('uncaughtException', function (err) {
    console.error('uncaughtException', err)
    logErr('uncaughtException', {
      data: err
    })
  })
  // app.set('port', config.port || 8080)
  app.listen(config.port || 8080, () => {
    console.log(`server started at localhost:${config.port || 8080}`)
  })
  // http.createServer(app).listen(app.get('port'), () => {
  //   if (process.env.NODE_ENV !== 'production') {
  //     console.log(`localhost:${config.port || 8080} projrct start！`)
  //   }
  // })
}
