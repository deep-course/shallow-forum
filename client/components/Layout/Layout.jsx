import React, { Fragment } from 'react'
import './layout.less'
import Nav from './Nav'
import Right from './Right'
import Login from '../Login/Index'

export default ({ children }) => (
  <Fragment>
    <div className="main-header">
      <div className="header-wrapper">
        <span className="title">澹台论坛</span>
        <Nav></Nav>
        <Right></Right>
      </div>
    </div>
    <div className="main-container">
      {children}
    </div>
  </Fragment>
)