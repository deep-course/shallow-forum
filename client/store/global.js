import {action, observable} from 'mobx'
import { getBoardSet } from '../api'

class Global {
  @observable tempLink = ''         // 登录后应该跳转页面
  @observable loginType = ''
  @observable loginTypeName = ''
  @observable taglist = {}      
  @observable laballist = {}  
  @observable sort = {
    1: '最新发布',
    2: '最新回帖',
    // 3: '最热贴'
  }
  
  // 修改state
  @action setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }

  // 获取论坛设置 及搜索项
  @action getBoardSet = () => {
    getBoardSet().then(res => {
      this.setState(res)
    })
  }
}

export default new Global()