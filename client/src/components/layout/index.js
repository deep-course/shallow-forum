import React, { Component } from 'react'
import CommonHeader from '../commonHeader'
import './index.scss'

class Layout extends Component {

  render() {
    return (
      <div>
        <CommonHeader></CommonHeader>
        <div className="container">
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Layout