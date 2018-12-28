/*
 * @Author: WeirdOwl
 * @Date: 2018-12-24 17:49:04
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-28 09:47:30
 */
// express jade
// res.render('index',{title:"hehe",test:"23"})
// res.send('') Sending data can be of any type
// res.sendFile() Sending file 
// res.sendStatus(200) Send the status code at the time of sending settings
// res.set('Content-Type', 'text/plain') //Setting the response header
// res.status(200) // Setting status code
// res.type('') // Set the file type of the response directly
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
  console.error(req.method)
  const _req = {
    ...url,
    fullUrl: req.url,
    method: req.method, // Type of current request  GET | POST
    // is: req.is, // Determine what type of file is requested
    // get: req.get.bind(req), // Get the parameters in the request header
    route: req.route, // Current matching routing regular expressions
    body: req.body, // Objects parsed when data sent by post
    params: req.params, // Matching params with /: ID /: name 
    path: req.path, // The path section containing the request URL
    query: req.query, // Objects parsed from query strings username=zhangsan&password=123 { username:zhangsan }
    protocol: req.protocol, // HTTP or HTTPS protocol
    originalUrl: req.originalUrl, // A backup of req. URL
    ip: req.ip, // View the client's IP address
    ips: req.ips, // IP address of proxy
    hostname: req.hostname, // Remove port number from host address
    fresh: req.fresh,
    cookies: req.cookies, // Cookies data sent by client
    baseUrl: req.baseUrl, // Basic Routing Address
    signedCookies: req.signedCookies}
  base.controllers[controller].bind({..._req, ...http})(cb)
  return true
}
module.exports = {
  // Request processing for GET type
  // Default return file type txt/html
  // Config has a header or type that you think you want to reset the return file type 
  get (req, res, urlkey) {
    if (!this.apisObject[urlkey]) {
      res.send('Data inconsistency, please restart the project')
      return false
    }
    const url = this.apisObject[urlkey]
    handel(req, url, this, (data = {}, config = {}) => {
      const _config = {...url, ...config}
      const header = config.header || null
      const type = config.type || null
      delete _config.controller
      delete _config.url
      // If there is a cookie saved, put it in
      if (_config.cookies) {
        const cookies = _config.cookies
        delete _config.cookies
        for (const key in cookies) {
          res.cookie(key, cookies[key], cookieConfig)
        }
      }
      // Clean up cookies
      if (_config.clearCookies) {
        const clearCookies = _config.clearCookies
        delete _config.clearCookies
        for (const key in clearCookies) {
          res.clearCookie(key)
        }
      }
      // Custom sending data format
      if (header || type) {
        for (const key in header) {
          res.setHeader(key, header[key])
        }
        if (type) {
          res.type(type)
        }
        res.status(200).send(data)
      } else {
        res.render(_config, data)
      }
    })
  },
  // Request processing for POST type
  post (req, res, urlkey) {
    if (!this.apisObject[urlkey]) {
      res.send('Data inconsistency, please restart the project')
      return false
    }
    const url = this.apisObject[urlkey]
    handel(req, url, this, (data = {}, config = {}) => {
      const status = config.status || 200
      // If there is a cookie saved, put it in
      if (config.cookies) {
        const cookies = config.cookies
        delete config.cookies
        for (const key in cookies) {
          res.cookie(key, cookies[key], cookieConfig)
        }
      }
      // Clean up cookies
      if (config.clearCookies) {
        const clearCookies = config.clearCookies
        delete config.clearCookies
        for (const key in clearCookies) {
          res.clearCookie(key)
        }
      }
      res.status(status).send(data)
    })
  },
  resExtends,
  reqExtends
}
