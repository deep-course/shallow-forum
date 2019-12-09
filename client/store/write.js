import {action, observable} from 'mobx'
import { getBoardSet } from '../api'

class Write {
  @observable taglist = {}      
  @observable laballist = {}  

  // 修改state
  @action setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }

  // 获取论坛设置
  @action getBoardSet = () => {
    getBoardSet().then(res => {
      this.setState(res)
    })
  }
}

export default new Write()