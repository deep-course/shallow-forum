import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/index.less'

import test from '../zhujin/test.less'
console.log(test)

@inject('user', 'search')
@observer
class Home extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }
  render() {
    const { list, loading } = this.props.search
    return (
      <div>
        <PageHead title="论坛-首页"></PageHead>
        <div className="index-list">
          {list.map((data, index) => (
            <ListItem data={data} key={index}></ListItem>
          ))}
          <div className={test.cssModule}>1111</div>
        </div>
      </div>
    )
  }
}

export default Home
