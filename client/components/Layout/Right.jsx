import React, { Component, Fragment } from 'react'
import { Button, Icon, Input, Dropdown, Menu } from 'antd'
import './right.less'
import { userSelectMap } from '../../contants/mock'

const menu = (
  <Menu>
    {userSelectMap.map(v => (
      <Menu.Item key={v.key}>
        <Icon type={v.icon} />
        <span>{v.value}</span>
      </Menu.Item>
    ))}
  </Menu>
);

class Right extends Component {
  handleSearch = () => {
    console.log(1)
  }

  render() {
    return (
      <div className="right">
        <Input className="search-input" placeholder="搜索内容" prefix={
          <Icon onClick={this.handleSearch} type="search" />
        } />
        {/* <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} overlayClassName="user-select">
          <div className="user">
            <Icon className="avatar" type="github" />
            <span className="name">kankisen</span>
          </div>
        </Dropdown> */}
        <Fragment>
          <span className="user-btn">登录</span>
          <span className="user-btn">注册</span>
        </Fragment>
      </div>
    )
  }
}

export default Right;