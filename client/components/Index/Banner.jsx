import React, { Component } from 'react'
import './banner.less'

class Banner extends Component {
  render() {
    return (
      <div className="banner">
        <span className="banner-title">求助</span>
        <span className="banner-desc">获取支持，包括使用、安装、开发插件等</span>
      </div>
    )
  }
}

export default Banner