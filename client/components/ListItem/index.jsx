import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Icon } from 'antd'
import moment from 'dayjs'
import './index.less'

@inject('global')
@observer
class PageHead extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { taglist, sort } = this.props.global
    const data = this.props.data
    return (
      <div className="slug-list-item">
        <div className="slug-list-item-left">
          <div className="slug-list-item-info">
            <span className="slug-list-item-type">{data.label}</span>
            <span className="slug-list-item-name">{data.username}</span>
            <span className="slug-list-item-time">{moment(new Date(data.pubtime)).format('YYYY/MM/DD HH:mm:ss')}</span>
            <span className="slug-list-item-label">前端</span>
          </div>
          <div className="slug-list-item-title">{data.title}</div>
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
        {data.image && (
          <div className="slug-list-item-right">
            <img src={data.image} alt="标题图" className="slug-list-item-img"/>
          </div>
        )}
      </div>
    )
  } 
}

export default PageHead