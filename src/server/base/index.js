/*
 * @Author: WeirdOwl
 * @Date: 2018-12-24 17:49:04
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-27 13:09:33
 */
const resExtends = require('./res.js')
const reqExtends = require('./req.js')
const http = require('./http.js')
const cookieConfig = {path: '/', httpOnly: true}
const handel = (req, url, base, cb) => {
  // 判断是否有处理函数
  const controller = url.controller || ''
  if (!controller || !base.controllers[controller]) {
    cb()
    return false
  }
  const _req = {
    ...url,
    fullUrl: req.url,
    body: req.body,
    params: req.params,
    path: req.path,
    query: req.query,
    protocol: req.protocol,
    originalUrl: req.originalUrl,
    ip: req.ip,
    ips: req.ips,
    hostname: req.hostname,
    fresh: req.fresh,
    cookies: req.cookies,
    baseUrl: req.baseUrl,
    signedCookies: req.signedCookies}
  base.controllers[controller].bind({..._req, ...http})(cb)
  return true
}
module.exports = {
  get (req, res, urlkey) {
    if (!this.apisObject[urlkey]) {
      res.send('Data inconsistency, please restart the project')
      return false
    }
    const url = this.apisObject[urlkey]
    handel(req, url, this, (data = {}, config = {}) => {
      const _config = {...url, ...config}
      const header = config.header || null
      delete _config.controller
      delete _config.url
      // 如果有存入的cookie 放入
      if (_config.cookies) {
        const cookies = _config.cookies
        delete _config.cookies
        for (const key in cookies) {
          res.cookie(key, cookies[key], cookieConfig)
        }
      }
      // 自定义发送数据格式
      if (header) {
        for (const key in header) {
          res.setHeader(key, header[key])
        }
        res.status(200).send(data)
      } else {
        res.render(_config, data)
      }
    })
  },
  post (req, res, urlkey) {
    if (!this.apisObject[urlkey]) {
      res.send('Data inconsistency, please restart the project')
      return false
    }
    const url = this.apisObject[urlkey]
    handel(req, url, this, (data = {}, config = {}) => {
      const status = config.status || 200
      // 如果有存入的cookie 放入
      if (config.cookies) {
        const cookies = config.cookies
        delete config.cookies
        for (const key in cookies) {
          res.cookie(key, cookies[key], cookieConfig)
        }
      }
      res.status(status).send(data)
    })
  },
  resExtends,
  reqExtends
}
