import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Router from 'next/router'
import { Menu, Dropdown, Icon } from 'antd'
import { clearToken } from '@utils/cookie';
import './index.less'

@inject( 'currentUser')
@observer
class User extends Component {
  constructor(props){
    super(props);
    //console.log(props);
  }

  // 登出
  logout = () => {
    clearToken();
    window.location.href="/"
    
  }

  // 进入登录页
  login = () => {
    window.location.href="/login";
  }

  // 进入设置页
  setting = () => {
    window.location.href="/user/setting";
  }

  initMenu = () => {
    const  isLogin = this.props.currentUser.checkLogin()
    const  {user} = this.props.currentUser
    if (isLogin) {
      return (
        <Menu>
          <Menu.Item>
            <Icon type="home" />
            <span>欢迎：{user.username}</span>
          </Menu.Item>
          <Menu.Item onClick={this.setting}>
            <Icon type="setting"/>
            <span>设置</span>
          </Menu.Item>
          <Menu.Item onClick={this.logout}>
            <Icon type="logout" />
            <span>登出</span>
          </Menu.Item>
        </Menu>
      )
    }
    return (
      <Menu>
        <Menu.Item onClick={this.login}>
          <Icon type="login" />
          <span>登录</span>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const isLogin=this.props.currentUser.checkLogin()
    const{user}=this.props.currentUser
    return (
      <>
        {!isLogin && (
          <Dropdown overlay={this.initMenu()} trigger={['click']}>
            <Icon type="user" className="global-user"/>
          </Dropdown>
        )}
        {isLogin && (
          <Dropdown overlay={this.initMenu()} trigger={['click']}>
            <img src={user.avatar} alt="user-icon" className="login-user"/>
          </Dropdown>
        )}
      </>
    )
  }
}

export default User
