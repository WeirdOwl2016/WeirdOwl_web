/**
 * 2017.10.24
 * lj
 * create
 */
let log4js = require('log4js')
let path = require('path')
let config = require(process.env.CONFIG_PATH)
let logconfig = null
if (process.env.NODE_ENV === 'devwatch') {
  logconfig = require('./log4jswatch.json')
} else {
  logconfig = require('./log4js.json')
}
logconfig.appenders.map(item => {
  if (item.filename && config.logURL) {
    item.filename = path.join(config.logURL, item.filename)
  }
  return item
})
log4js.configure(logconfig)
let logInfo = log4js.getLogger('info')
let logErr = log4js.getLogger('error')

function printInfo (printObj, {
  key = 'INFO', // 消息类型 INFO：普通消息； PAGE_RNDER: 页面发送信息; PAGE_START: 工程开始接到页面请求； PORT_START: 工程开始接到接口请求 PORT_END: 接口返回；PORT_SEND_START: 工程开始想第三方服务发送请求； PORT_SEND_END: 工程向第三方服务发送请求结束；PORT_SEND_ERROR: 向第三方接口发送请求异常
  rout = null, // 在那个页面浏览器地址
  url = null, // 接口地址
  startTime = null,
  data = null,
  cookie = null,
  reqExclude = [], // 请求参数那些字段比较大，不必写进前台的日志文件的，例如图片上传的content字段
  requestData = null, // 接口请求参数
  responseData = null // 几口返回数据
}) {
  let _startTime = startTime ? `${startTime.toLocaleString()}:${startTime.getMilliseconds()}` : ''
  let _rout = rout ? `[${rout}]:` : ''
  let _url = url ? `[${url}]` : ''
  let _data = data ? `DATA:${typeof data === 'object' ? JSON.stringify(data) : ''};\n` : ''
  let _cookie = cookie ? `COOKIE:${typeof cookie === 'object' ? JSON.stringify(cookie) : ''};\n` : ''
  let _responseData = responseData ? `RESPONSE:${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)};\n` : ''
  let _requestData = requestData
  // 对requestdata 默写字段比较大，只打出尾, 且只针对该字段数据类型是string
  if (reqExclude.length) {
    try {
      if (typeof _requestData === 'string') {
        _requestData = JSON.parse(_requestData)
      }
      reqExclude.map(item => {
        let tmp = _requestData[item] || _requestData.data[item] || null
        if (tmp && typeof tmp === 'string') {
          tmp = `delete end: ${tmp.slice(-10)}`
          if (_requestData[item]) {
            _requestData[item] = tmp
          } else if (_requestData.data[item]) {
            _requestData.data[item] = tmp
          }
        }
      })
    } catch (e) {}
  }
  _requestData = _requestData ? `REQUEST:${typeof _requestData === 'string' ? _requestData : JSON.stringify(_requestData)};\n` : ''
  printObj.info(`--------------------------------------------------------------\n${key}:${_startTime}${_url}${_rout}\n${_data}${_requestData}${_responseData}${_cookie}`)
}
/**
 * @param key SEND: api call , RENDER: page drawing
 * @param rout  router info
 * @param reqTime api require time
 * @param options api params
 * @param resData api callback time
 */
module.exports = {
  logErr (key, options = {}) {
    let _options = options
    options.key = key
    printInfo(logErr, _options)
  },
  logInfo (key, options = {}) {
    let _options = options
    options.key = key
    printInfo(logInfo, _options)
  },
  log4js,
  defaultInfo: logInfo
}
