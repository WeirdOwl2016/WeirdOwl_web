/*
 * @Author: yueLanFengHua
 * @Date: 2018-06-20 16:01:54
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-26 14:11:43
 * @version:1.1.0
 */
const fs = require('fs')
const path = require('path')
// let files = fs.readdirSync(path.join(process.env.SERVER_PATH, 'controllers'))
let files = fs.readdirSync('src/server/controllers')
let controllers = {}
files.map(file => {
  if (file === 'index.js' || file === 'common' || file === '.svn') {
    return false
  }
  let controller = require(`./${file}`)
  if (controller) {
    for (let key in controller) {
      controllers[`${file.split('.')[0]}/${key}`] = controller[key]
    }
  }
})
module.exports = controllers
