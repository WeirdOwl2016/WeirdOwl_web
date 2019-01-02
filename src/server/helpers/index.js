module.exports = {
  /**
   * 复杂表达式运算
   * 2018.5.15
   * lj
   */
  operation: function (expression) {
    let rsultStr = ''
    let symbol = ['<', '>', '==', '===', '||', '+', '-', '*', '&&', '>=', '<=', ')', '(', '/', '!', '!=', '!==', 'undefined', 'null']
    for (let i = 0; i < arguments.length - 1; i++) {
      let _str = arguments[i]
      if (typeof _str !== 'string') {
        _str = JSON.stringify(_str)
      } else if (typeof _str === 'string' && symbol.indexOf(_str) < 0) {
        _str = `"${_str}"`
      }
      rsultStr = rsultStr + _str
    }
    let result = null
    try {
      result = new Function('return ' + rsultStr)()
    } catch (e) {
      result = 'error:rsultStr;' + e + 'rsultStr:' + rsultStr
    }
    return result
  },
  /**
   * [JSON转换]
   * @param  {[object]} json     [description]
   * date:
   * auto:
   * dec:
   */
  toJsonString: function (el) {
    if (el) {
      var a = JSON.stringify(el, null, 2)
      if (a) a = a.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return a
    } else {
      return 'null'
    }
  },
  toJsonParse: function (v) {
    return JSON.parse(v).toString()
  },
  unescapeHTML: function (a) {
    var b = '' + a
    return b.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  },
  /**
   * 2018.1.10
   * lj
   * 手机号掩码
   */
  mobileMask: function (mobile) {
    let _mobile = mobile + ''
    return _mobile.substr(0, 3) + '***' + _mobile.substr(7, 4)
  },

  /**
   * [formatNum 格式化]
   * @param  {[stirng]} num     [description]
   * @param  {[sting]} options [description]
   * @return {[type]}         [description]
   * date:
   * auto:
   * dec:
   */
  formatNum: function (num, options) {
    // console.log("options",options)

    // d : 取几位小数点
    // int: 是否取整
    // round : 是否四舍五入
    // floor: 小数点只舍不入

    if (!num) {
      return false
    }
    if (options && (typeof options !== 'object')) {
      try {
        options = JSON.parse(options)
      } catch (e) {
        // console.error(e + '请配置标准json格式')
      }
    }

    num = Number(num)

    if (options.int) { // 是否取整
      if (options.round) { // 是否四舍五入
        num = Math.round(num)
      } else {
        num = parseInt(num)
      }
      num = options.d ? num.toFixed(options.d) : num.toFixed(2)
    } else {
      let pow = options.d ? options.d : 2

      if (options.floor) {
        num = Math.floor(num * Math.pow(10, pow))
        num = num / Math.pow(10, pow)
      } else {
        num = options.d ? num.toFixed(options.d) : num.toFixed(2)
      }
    }

    // num = options.d ? num.toFixed(options.d) : num.toFixed(2)
    // num = num +''
    function comma (num) {
      let source = String(num).split('.') // 按小数点分成2部分
      source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,') // 只将整数部分进行都好分割
      return source.join('.') // 再将小数部分合并进来
    }

    return comma(num)
  },
  /*
  * 毫秒数过滤成日期
  * chenbs
  * */
  dateFormat: function (value) {
    if (typeof value !== 'undefined') {
      if (value) {
        var date = new Date(parseInt(value)) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var hour = date.getHours() < 10 ? (date.getHours() == 0 ? '00' : '0' + date.getHours()) : date.getHours()
        var Minutes = date.getMinutes() < 10 ? (date.getMinutes() == 0 ? '00' : '0' + date.getMinutes()) : date.getMinutes()
        var Seconds = date.getSeconds() < 10 ? (date.getSeconds() == 0 ? '00' : '0' + date.getSeconds()) : date.getSeconds()
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
        var h = hour + ':'
        var m = Minutes + ':'
        var s = Seconds
        return Y + M + D + h + m + s
      } else {
        return ''
      }
    }
  },
  _if: function () {
    let options = arguments[arguments.length - 1]
    let evalStr = ''
    let symbol = ['<', '>', '==', '===', '&&', '||', '>=', '<=', ')', '(', '-', '+', '!', '!=', '!==', 'undefined', 'null']
    try {
      for (let i = 0; i < arguments.length - 1; i++) {
        let value = arguments[i]
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        } else if (typeof value === 'string' && symbol.indexOf(arguments[i]) < 0) {
          let status = true
          if (!value.match(/^[0-9]*$/) && !value.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
            value = `"${value}"`
            status = false
          }
          if (status && ((value.match(/^[0-9]*$/) && value[0] === '0') || value === '')) {
            value = `"${value}"`
          }
        }
        evalStr += value
      }
      
      // console.error('return ' + evalStr)
      let result = new Function('return ' + evalStr)()
      if (result) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    } catch (e) {
      // console.error(e)
      throw new Error('表达式有误，请检查:' + evalStr)
    }
  },
  /**
   * 转换html
   * 2018.1.15
   * lj
   */
  toHtml: function (a) {
    a = '' + a
    // console.error(a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'"))
    return a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  },

  /*
  * 根据字典数据渲染select
  * chenbs
  * 2018年2月1日
  * */
  selectPing: function (_data, opts) {
    let option = ''
    if (typeof _data !== 'undefined' && _data.length > 0) {
      if (_data instanceof Array) {
        try {
          opts = JSON.parse(opts)
        } catch (err) {
          // console.log(err)
        }
        _data.forEach(function (item) {
          if (item.flag === opts.num) {
            item.dict.forEach(function (i) {
              option += '<option value="' + i.value + '">' + i.label + '</option>'
            })
            return option
          }
        })
      } else {
        // console.error('请输入一个数组')
      }
    }
    return option
  }

}
