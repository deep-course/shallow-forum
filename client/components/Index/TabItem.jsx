import React, { Component } from 'react'
import { Icon } from 'antd'

import './tabItem.less'
class TabItem extends Component {
  render() {
    const { data } = this.props
    return (
      <li className="index-tab-item" style={{marginBottom: data.color ? '' : '30px'}}>
        {!data.color && 
          <Icon type="appstore" style={{fontSize: '16px', color: '#667c99', marginRight: '16px'}} />
        }
        {data.color && 
          <span className="color" style={{background: data.color}}></span>
        }
        <span className="con">{data.name}</span>
      </li>
    )
  }
}

export default TabItem