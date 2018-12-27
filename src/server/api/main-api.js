/**
 * 2017.10.27
 * lj
 * create
 * title: string, pageTitle, default:index
 * view: string, template: request default:404
 * layout: string, default:main
 * isAuth: Do you need to log in, default:false
 * description: string, default:''
 * keywords: string, default:''
 * requireType GET or POST or ALL defalut: POST
 * controller: string manipulation function format :file name/function name:
 * homeKey: port requist host, default hostname
 */
const message = require('../message/public')
module.exports = [
  /**
   * 2017.12.11
   * yxf
   * 首页
   */
  {
    url: '/',
    title: message.INDEX01,
    view: 'rule/rule',
    isAuth: true,
    layout: 'main',
    description: '',
    controller: 'rules/index',
    requireType: 'GET'
  },
  {
    url: '/rt',
    title: message.INDEX01,
    view: 'rule/rule',
    isAuth: true,
    layout: '',
    description: '',
    controller: 'rules/index',
    requireType: 'GET'
  }
]
