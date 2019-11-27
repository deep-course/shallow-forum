import {action, observable} from 'mobx'

class Search {
  @observable 
  list = [{}, {}, {}, {}]
  loading = false
  
  @action 

  // 修改state
  setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }
}

export default new Search()