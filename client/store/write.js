import {action, observable} from 'mobx'
import {  boardDeleteImg } from '../api'

class Write {
  // 修改state
  @action setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }

  // 删除图片附件
  @action deleteImg = (fileurl) => {
    boardDeleteImg({fileurl}).then(res => {
      console.log(res)
    })
  }
  
}

export default new Write()