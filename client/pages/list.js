import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import TagList from '../components/TagList'
import '../assets/pageStyle/index.less'
import { getPostList } from '../api'
import { List, Spin, Divider, Tag } from 'antd'

import nookies from 'nookies'

@inject('global')
@observer
class PostList extends React.Component{
  static async getInitialProps ({ ctx}) {
    //这里写服务端的初始化代码，就是ssr第一次首屏现实的东西
    //nookies获取cookies信息
    const cookies=nookies.get(ctx)
    const {main,sub=''}=ctx.query
    let tag=main
    if (sub.length>0)
    {
      tag=main+","+sub
    }
    const postlist=await getPostList({
      sort: 1,
      page: 1,
      tag,
    },cookies);
    return {  postlist ,tag,main,sub};
  }
 
  constructor(props) {
    super(props)
    this.state = {
      filter: {
        sort: 1,
        page: 1,
        tag:this.props.tag
      },
      list: props.postlist,
      loading: false,
    }

  }

  componentDidMount() {
    //这里写客户端的初始化代码

  }

  render() {
    const {  sort } = this.props.global
    const {taglist}=this.props
    const { filter, list, loading, hasMore } = this.state
    return (
      <div>
        <PageHead title="论坛-列表页"></PageHead> 

      <TagList taglist={taglist} maintag={this.props.main} subtag={this.props.sub}></TagList>

        <div className="index-filter-tab">
          {Object.keys(sort).length && (
            Object.keys(sort).map((k, i) => (
              <li 
                className={`index-filter-tab-item ${filter.sort == k ? 'current' : ''}`} 
                key={i} 
                onClick={() => this.chooseFilter({sort: k})}>{sort[k]}</li>
            ))
          )}
        </div>
        <div className="index-list">
        
            <List
              dataSource={list}
              renderItem={(item,index) => {
                if(item){
                  return <ListItem data={item} index={index}></ListItem>
                }else{
                  return <div></div>
                }
              }                
              }
            >
              {loading && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </List>

        </div>
      </div>
    )
  }
}

export default PostList
