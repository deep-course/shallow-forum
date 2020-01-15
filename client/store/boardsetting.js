import {action, observable} from 'mobx'
import { getBoardSet } from '../api'

class BoardSetting {
    @observable taglist = []
    @observable  labellist = {}
    sort = {
        1: '最新发布',
        2: '最新回帖',
        //3: '最热贴'
    }
    constructor(initialData={}) {
        if(Object.keys(initialData).length==0)
        {
            console.log("Client BoardSetting")
            getBoardSet().then(res => {
                this.taglist=res.taglist
                this.labellist=res.labellist
            })
        }
        else
        {
            //console.log("SSR BoardSetting")
            this.taglist=initialData.taglist
            this.labellist=initialData.laballist

        }
    }
    @action
    async initialData(cookies={}){

    }


}

export default BoardSetting