import React, { Component } from 'react'
import { Icon } from 'antd'
import './listItem.less'
import { tabList } from '../../contants/mock' 

class ListItem extends Component {
  render() {
    const { avatar, title, name, date, type, comment, star } = this.props.data
    return (
      <>
        <div className="index-list-item">
          <div className="left">
            <img src={ avatar } className="avatar"/>
            <div className="title">
              <span className="name">{ title }</span>
              <span className="date">
                <span className="person">{ name }</span>
                <span>{ date }</span>
              </span>
            </div>
          </div>
          <div className="right">
            <span className="type" style={{background: tabList.filter(v => v.type == type)[0].color}}>{ tabList.filter(v => v.type == type)[0].name }</span>
            <span className="comment">
              <Icon type="message" />
              { comment }
            </span>
            <span className="star">
              <Icon type="like" />
              { star }
            </span>
          </div>
        </div>
      </>
    )
  }
}

export default ListItem