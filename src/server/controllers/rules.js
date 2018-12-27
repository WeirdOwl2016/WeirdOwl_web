/*
 * @Author: WeirdOwl
 * @Date: 2018-12-24 17:45:54
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2018-12-27 13:07:18
 */

module.exports = {
  index (next) {
    console.log(this)
    next({data:72357252})
  }
}
