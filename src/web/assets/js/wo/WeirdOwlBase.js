export default class WeirdOwlBase {
  /**
    * 序列化地址参数
    */
  urlStringify (url, query = {}) {
    var _url = url || ''
    var _query = query || {}
    for (var key in _query) {
      if (_url.split('?').length > 1) {
        _url = _url + '&' + key + _query[key]
      } else {
        _url = _url + '?' + key + _query[key]
      }
    }
    return _url
  }
  /**
   * 掩码处理
   * @param {*} str
   * @param {*} brforeBit
   * @param {*} afterBit
   * @param {*} starBit 星号
   */
  strMask(str, brforeBit = 3, afterBit = 4, starBit = '****') {
    if (!str) {
      return ''
    }
    return str.substr(0, brforeBit) + starBit + str.substr(str.length - afterBit, afterBit)
  }
  /**
   * 日期格式化2位
   */
  fomatDate(year, month, day) {
    let _month = this.int(month)
    _month = _month < 10 ? `0${_month}` : _month
    let _day = this.int(day)
    _day = _day < 10 ? `0${_day}` : _day
    return `${year}-${_month}-${_day}`
  }
  /**
   * 金额式化
   * @param {*} money
   * @param {*} separate // 是否分隔
   * @param {*} decimal // 是否保留两位小数
   */
  abs(money, separate = false, decimal = false) {
    if (!money) { return decimal ? '0.00' : 0 }
    const str = money.toString()
    const dotPos = str.indexOf('.')
    const len = dotPos < 0 ? str.length : dotPos
    let intSum = str.substring(0, len)// 取到整数部分
    if (separate) {
      intSum = intSum.replace(/\B(?=(?:\d{3})+$)/g, ',')
    }
    let dot = ''
    if (decimal) {
      if (dotPos >= 0) {
        dot = str.substring(str.length, dotPos) + '00'// 取到小数部分搜索
        dot = dot.substring(0, 3)
      } else {
        dot = '.' + parseFloat(money).toFixed(2).toString().split('.')[1]
      }
    } else {
      dot = dotPos >= 0 ? '.' + str.split('.')[1] : ''
    }
    return intSum + dot
  }
}
