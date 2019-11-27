import {action, observable} from 'mobx'

class User {
  @observable 
  isLogin = true        // 是否登录
  userName = ''         // 用户名
  tempLink = ''         // 登录后应该跳转页面
  

  @action 
  // 修改state
  setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }
}

export default new User()