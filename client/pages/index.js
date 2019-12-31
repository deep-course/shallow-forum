import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import TagList from '../components/TagList'
import '../assets/pageStyle/index.less'
import { getHomeList } from '../api'
import InfiniteScroll from 'react-infinite-scroller'
import { List, Spin, Divider, Tag } from 'antd'

import nookies from 'nookies'

@inject('global')
@observer
class Index extends React.Component{
  static async getInitialProps ({ ctx }) {
    //这里写服务端的初始化代码，就是ssr第一次首屏现实的东西
    //nookies获取cookies信息
    const cookies=nookies.get(ctx);
    //console.log(ctx);
    const postlist=await getHomeList({
      sort: 1,
      page: 1,
    },cookies);
    return {  postlist };
  }
 
  constructor(props) {
    super(props)
    this.state = {
      filter: {
        sort: 1,
        page: 1,
      },
      list: props.postlist,
      loading: false,
      finish: false,
    }

  }

  componentDidMount() {
    //这里写客户端的初始化代码

    //console.log(this.state);
    this.chooseFilter({sort: 1})

  }

  // 搜索
  chooseFilter = (obj) => {
    // 重置第一页
    this.setState({ 
      filter: { 
        ...this.state.filter, 
        page: 1,  
        ...obj
      } 
    })
    setTimeout(() => {
      this.getPostList(true)
    })
  }

  // 获取帖子列表
  getPostList = (clear=false) => {
    this.setState({loading: true})
    getHomeList(this.state.filter).then(res => {
      if (res.length) {
        if(clear){
          this.setState({
            list: [...res]
          })
        }
        else
        {
          this.setState({
            list: [...this.state.list, ...res]
          })
        }

      } else {
        // 无结果 已加载全部
        this.setState({hasMore: false})
      }
      this.setState({loading: false})
    }, () => {
      this.setState({loading: false})
    })
  }

  //无限滚动加载
  handleInfiniteOnLoad = (page) => {
    if(page>10){
      this.setState({hasMore: false})
    }
    this.setState({ 
      filter: { 
        ...this.state.filter, 
        page,
      } 
    })
    setTimeout(() => {
      this.getPostList()
    })
  }
    

  render() {
    const {  sort } = this.props.global
    const {taglist}=this.props
    const { filter, list, loading, hasMore } = this.state
    return (
      <div>
        <PageHead title="论坛-首页"></PageHead> 

      <TagList taglist={taglist}></TagList>

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
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!loading && hasMore}
          >
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
              {loading && hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
              {!hasMore && (
                <Divider>到底了</Divider>
              )}
            </List>
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default Index
