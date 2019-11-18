import React, { Component } from 'react'
import { Button, Icon, Input, Dropdown, Menu } from 'antd'
import './index.scss'

class CommonHeader extends Component {
  constructor() {
    super()
    this.state = {
      hasLogin: false
    }
  }

  goLogin() {
    window.location.href = '/login.html'
  }

  render() {
    const menu = (
      <Menu>
        {[
          {
            key: 'write',
            value: '我的资料',
            icon: 'user',
            link: 'info'
          },
          {
            key: 'self',
            value: '个人设置',
            icon: 'setting',
            link: 'setup'
          },
          {
            key: 'logout',
            value: '登出',
            icon: 'login',
            link: 'logout'
          },
        ].map(v => (
          <Menu.Item key={v.key}>
            <Icon type={v.icon} />
            <span>{v.value}</span>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="common-header">
        <div className="common-header-wrapper">
          <div className="common-header-content">
            <span className="title">澹台论坛</span>
            <div className="nav">
              <Button type="link" className="current">首页 </Button>
              <Button type="link">题库 </Button>
              <Button type="link">小册 </Button>
            </div>
            <div className="right">
              <Input className="search-input" placeholder="搜索内容" prefix={
                <Icon onClick={this.handleSearch} type="search" />
              } />
              { 
                this.hasLogin && (
                <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} overlayClassName="user-select">
                  <div className="user">
                    <Icon className="avatar" type="github" />
                    <span className="name">kankisen</span>
                  </div>
                </Dropdown>
                )
              }
              {
                !this.hasLogin && (<>
                  <span className="user-btn" onClick={this.goLogin}>登录</span>
                </>)
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CommonHeader