/*
 * @Author: WeirdOwl
 * @Date: 2018-12-24 17:45:54
 * @Last Modified by: WeirdOwl
 * @Last Modified time: 2019-01-02 16:27:37
 */

module.exports = {
  page (next) {
    next(this.query)
  }
}
