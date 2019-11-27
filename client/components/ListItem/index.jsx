import React, { Component } from 'react'
import { Icon } from 'antd'
import './index.less'

class PageHead extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="slug-list-item">
        <div className="slug-list-item-left">
          <div className="slug-list-item-info">
            <span className="slug-list-item-type">专栏</span>
            <span className="slug-list-item-name">tant</span>
            <span className="slug-list-item-time">3小时前</span>
            <span className="slug-list-item-label">前端</span>
          </div>
          <div className="slug-list-item-title">前端领域的Docker</div>
          <div className="slug-list-item-action">
            <span className="slug-list-item-action-item">
              <Icon type="like" />
              <span>7</span>
            </span>
            <span className="slug-list-item-action-item">
              <Icon type="message" />
              <span>7</span>
            </span>
          </div>
        </div>
        <div className="slug-list-item-right">
          <img src="/static/user-test.png" alt="标题图" className="slug-list-item-img"/>
        </div>
      </div>
    )
  } 
}

export default PageHead