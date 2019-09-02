import React, { Component, Fragment } from 'react'
import { Button } from 'antd' 
import './nav.less'

class Nav extends React.Component {

  render() {
    return (
      <div className="nav">
        <Button type="link" className="current">首页 </Button>
        <Button type="link">题库 </Button>
        <Button type="link">小册 </Button>
      </div>
    );
  }
}

export default Nav;