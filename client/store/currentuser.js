import {action, computed, observable} from 'mobx'
import {getBoardSet, getUserInfo} from '../api'

class CurrentUser {

    @observable user = {}
    @observable group = {}
    @observable board = {}

    @action setState(payload) {
        Object.keys(payload).forEach(key => {
            this[key] = payload[key]
        })

    }
    constructor(initialData={}) {
        if(Object.keys(initialData).length==0)
        {
            console.log("Client CurrentUser")
            getUserInfo().then(res => {
                if (Object.keys(res).length) {
                    this.setState(res)
                }
            })
        }
        else
        {
            //console.log("SSR BoardSetting")
            this.setState(initialData)
        }
    }
    // 获取用户信息
    initialData(cookies={}) {

    }

    //检测是否登录


    checkLogin() {
        if (this.user && Object.keys(this.user).length > 0) {
            return true;
        } else {
            return false;
        }


    }
}


export default CurrentUser