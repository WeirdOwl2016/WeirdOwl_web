/*
 * @Author: WeirdOwl
 * @Date: 2018-12-24 17:43:25
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-29 18:06:49
 */
const path = require('path')
const {logInfo} = require('../log4')
const isProd = process.env.NODE_ENV === 'production'
const config = require(process.env.CONFIG_PATH)
const cookieConfig = {path: '/', httpOnly: true}
const helpers = require('../helpers')
/**
 * // 改写页面渲染
 * @param {json} pageConfig
 * {title = 'index', description = '', layout = 'main', view = '404', keywords = '', helpers = {}}
 * @param {json} data 渲染数据
 */
const render = function (pageConfig = {}, data = {}) {
  const pagToken = Math.random() * 10000
  this.cookie('pagToken', pagToken, cookieConfig)
  const view = pageConfig.view || '404'
  const _pageConfig = {...pageConfig}
  const staticURL = config.staticURL || ''
  // 设置模板
  if (_pageConfig.layout) {
    _pageConfig.layout = path.join(process.env.ROOT, 'dist/views/layouts', pageConfig.layout)
  }
  delete _pageConfig.view
  _pageConfig.helpers = {...helpers, ..._pageConfig.helpers}
  this.renderPage(view, {
    ..._pageConfig,
    pageSign: pageConfig.pageSign || this.req.path.replace(/\//, '').replace(/\//g, '_'),
    staticURL,
    pagToken,
    userInfo: this.locals.userInfo || null,
    ...data
  })
}
const render404 = function (req, res) {
  const _render = this.render
}
const render500 = function (req, res, err) {
  const _render = this.render
}
module.exports = (req, res, next) => {
  res.renderPage = res.renderPage || res.render
  res.render = render
  res.render404 = render404
  res.render500 = render500
  next && next()
}
