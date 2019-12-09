import {action, observable} from 'mobx'

class Global {
  @observable 
  tempLink = ''         // 登录后应该跳转页面

  @action 
  // 修改state
  setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }
}

export default new Global()