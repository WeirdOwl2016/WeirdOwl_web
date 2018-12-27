/*
 * @Author: WeirdOwl
 * @Date: 2018-12-24 17:49:04
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-26 13:43:30
 */
const fs = require('fs')
const path = require('path')
const rootPath = process.env.ROOT
const isProd = process.env.NODE_ENV === 'production'
// const getFile = (filePath) => {
//   let files = fs.readdirSync(filePath)
//   let _files = {}
//   files.map(file => {
//     if (file === 'common' || file === '.svn') {
//       return false
//     }
//     let flie = require(path.join(filePath, file))
//     if (flie) {
//       for (let key in flie) {
//         _files[`${file.split('.')[0]}/${key}`] = flie[key]
//       }
//     }
//   })
//   return _files
// } 
const resExtends = require('./base/res.js')
const reqExtends = require('./base/req.js')
// let controllers
// let apis
// if (isProd) {
//   controllers = getFile(path.join(rootPath, 'server/controllers'))
//   apis = getFile(path.join(rootPath, 'server/api'))
// }

module.exports = {
  get: (req, res, cb) => {
    cb({content: '875878'})
  },
  post: (req, res, cb) => {
    cb({a: 5})
  },
  resExtends,
  reqExtends
}
