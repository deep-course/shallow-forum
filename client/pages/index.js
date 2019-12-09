import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/index.less'
import { getHomeList } from '../api'

@inject('global', 'search')
@observer
class Index extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }

  // 获取首页列表
  getHomeList = () => {
    getHomeList().then(res => {
      console.log(res)
    })
  }

  componentDidMount() {
    this.getHomeList()
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
        </div>
      </div>
    )
  }
}

export default Index
