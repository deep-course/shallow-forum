import {action, observable} from 'mobx'
import { trim } from 'lodash' 
import { message } from 'antd'
import Router from 'next/router'
import { clearToken } from '@utils/cookie';
import { getUserInfoDetail, updateUserInfoDetail, updatePassword } from '../api'

class UserSetting {
  @observable avatar= ''
  @observable bio = ''
  @observable oldPassword = ''
  @observable newPassword = ''
  @observable confirmPassword = ''  

  // 修改state
  @action setState = (payload) => {
    Object.keys(payload).forEach(key => {
      this[key] = payload[key]
    })
  }

  // 获取用户详细信息
  @action getUserInfoDetail = () => {
    return getUserInfoDetail().then(res => {
      this.setState(res)
    })
  }
  @action setUserAvatar=(url)=>{
    this.avatar=url;
  }

  // 更新用户信息
  @action updateUserInfoDetail = params => {
    return updateUserInfoDetail(params).then(() => {
      this.setState(params)
    })
  }

  // 修改密码
  @action updatePassword = () => {
    if (!trim(this.oldPassword)) {
      message.error('请输入旧密码')
      return ;
    }
    if (!trim(this.newPassword)) {
      message.error('请输入新密码')
      return ;
    }
    if (trim(this.confirmPassword) !== trim(this.newPassword)) {
      message.error('新密码与确认密码不符')
      return ;
    }

    return updatePassword({
      oldpass: this.oldPassword,
      newpass: this.newPassword
    }).then(() => {
      message.success('密码修改成功')
      clearToken()
      this.setState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        isLogin: false
      })
      Router.replace('/login')
    })
  }

  // 登出重置
  @action resetUserInfo = () => {
    this.avatar = ''
    this.bio = ''
  }
}

export default new UserSetting()