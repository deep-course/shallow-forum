import {action, observable} from 'mobx'

class Detail {
  @observable 
  commentList = [{}, {}, {},{}, {}, {},{}, {}, {},{}, {}, {},{}, {}, {}]
  commentloading = false
  commentTotal = 3
  

  @action 
  // 修改state
  setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }
}

export default new Detail()