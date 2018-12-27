/**
 * 2017.10.27
 * lj
 * create
 */
const fs = require('fs')
let files = fs.readdirSync('src/server/api')
let apisArry = []
let apisObject = {}
files.map(file => {
  if (file === 'index.js' || file === 'common' || file === '.svn') {
    return false
  }
  let api = require(`./${file}`)
  if (api) {
    apisArry = apisArry.concat(api)
    for (let index in api) {
      apisObject[api[index].url] = api[index]
    }
  }
})
module.exports = {apisArry, apisObject}
