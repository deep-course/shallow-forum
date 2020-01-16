import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Router from 'next/router';
import { Icon, List } from 'antd'
import moment from 'dayjs'
import './index.less'

@inject('boardSetting')
@observer
class ListItem extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { labellist } = this.props.boardSetting
    const { data, index,key } = this.props
    return (
      <li className="slug-list-item">
        <div className="slug-list-item-left">
          <div className="slug-list-item-info">
            {data.label>0 && (<span className="slug-list-item-type">{labellist[data.label]}</span>) }
            <a className="slug-list-item-name" href={`/u/${data.userslug}`}>{data.username}</a>
            <span>·</span>
            <span className="slug-list-item-time">{moment(new Date(data.pubtime)).format('YYYY/MM/DD HH:mm:ss')}</span>
            {/* <span className="slug-list-item-label">前端</span> */}
          </div>
          <div className="slug-list-item-title">
            <a href={`/p/${data.slug}`}>{data.title}</a>
             
            </div>
          <div className="slug-list-item-action">
            <span className="slug-list-item-action-item">
              <Icon type="like" />
              <span>{data.upcount}</span>
            </span>
            <span className="slug-list-item-action-item">
              <Icon type="message" />
              <span>{data.commentcount}</span>
            </span>
          </div>
        </div>
        {data.image && (
          <div className="slug-list-item-right">
            <img src={data.image} alt="标题图" className="slug-list-item-img"/>
          </div>
        )}
      </li>
    )
  } 
}

export default ListItem