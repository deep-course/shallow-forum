import React, { Component } from 'react'
import Router, { withRouter } from 'next/router'
import Link from 'next/link'
import { Input, Button } from 'antd'
import { observer, inject } from 'mobx-react'
import User from '../../components/User'

import './index.less'

const { Search } = Input

@inject('currentUser')
@observer
class Layout extends Component {
  noNeedLayoutRouterMap = ['/login', '/write','/edit']
  componentDidMount() {
    //this.props.user.getUserInfo()
    //this.props.global.getBoardSet()
  }

  render() {
    const routeName = this.props.router.route
    const noNeedLayout = this.noNeedLayoutRouterMap.includes(routeName)
    return (
      <>
        {noNeedLayout && this.props.children}
        {!noNeedLayout && (
          <>
            <div className="layout-header">
              <div className="layout-header-wrapper">
                <div className="layout-header-real-wrapper">
                  <div className="layout-header-logo">
                    <img src="//images.deephub.ai/logo.png" alt="logo"/>
                  </div>
                  <ul className="layout-header-type">
                    <li className="layout-header-type-item">
                        <a href="/">首页</a>
                    </li>
                    {/* <li className="layout-header-type-item">题库</li> */}
                  </ul>
                  {/* <div className="layout-header-search">
                    <Search placeholder="搜索" onSearch={value => console.log(value)} enterButton />
                  </div> */}


                      {
                        this.props.currentUser.checkLogin() &&  <div className="layout-header-write">
                          <Button type="primary">
                            <a href="/write">写文章</a>
                          </Button>
                        </div>
                      }



                  <div className="layout-header-user">
                    <User></User>
                  </div>
                </div>
              </div>
            </div>
            <div className="layout-container">{ this.props.children }</div>
          </>
        )}
      </>
    )
  }
}

export default withRouter(Layout)