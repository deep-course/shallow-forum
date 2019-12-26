import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Router from 'next/router'
import { Menu, Dropdown, Icon } from 'antd'
import { setToken } from '@utils/cookie';
import './index.less'

@inject('global', 'user')
@observer
class User extends Component {
  constructor(props){
    super(props);
  }

  // 登出
  logout = () => {
    setToken('');
    Router.push('/login')
    this.props.user.resetUserInfo()
  }

  // 进入登录页
  login = () => {
    Router.push('/login')
  }

  // 进入设置页
  setting = () => {
    Router.push('/setting')
  }

  initMenu = () => {
    const { isLogin } = this.props.user
    if (isLogin) {
      return (
        <Menu>
          <Menu.Item>
            <Icon type="home" />
            <span>我的主页</span>
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
    let { isLogin, avatar } = this.props.user
    return (
      <>
        {!isLogin && (
          <Dropdown overlay={this.initMenu()} trigger={['click']}>
            <Icon type="user" className="global-user"/>
          </Dropdown>
        )}
        {isLogin && (
          <Dropdown overlay={this.initMenu()} trigger={['click']}>
            <img src={avatar} alt="user-icon" className="login-user"/>
          </Dropdown>
        )}
      </>
    )
  }
}

export default User
