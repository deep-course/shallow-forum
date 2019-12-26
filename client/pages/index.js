import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/index.less'
import { getHomeList } from '../api'
import Router from 'next/router';
import InfiniteScroll from 'react-infinite-scroller'
import { List, Spin, Divider, Tag } from 'antd'
const { CheckableTag } = Tag;

@inject('global')
@observer
class Index extends React.Component{
  static async getInitialProps ({ ctx }) {
    const { query } = ctx;
    const {
      main = '',
      sub = '',
      list = []
    } = query;
    return { mainTag: main, subTag: sub, list };
  }
  constructor() {
    super()
    this.state = {
      filter: {
        mainTag: '',
        subTag: '',
        sort: 1,
        page: 2,
      },
      list: [],
      loading: false,
      hasMore: true,
    }
  }

  componentDidMount() {
    const {
      mainTag,
      subTag,
      list
    } = this.props;
    this.setState({ 
      list,
      filter: { 
        ...this.state.filter, 
        mainTag,
        subTag
      }
    });
    if(list.length == 0){
      this.setState({
        hasMore: false
      })
    }
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
      this.getPostList()
    })
  }

  // 获取帖子列表
  getPostList = () => {
    this.setState({loading: true})
    getHomeList(this.state.filter).then(res => {
      if (res.length) {
        this.setState({
          list: [...this.state.list, ...res]
        })
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
  };
  
  //主标签点击
  mainTagClick = (mainTag) => {
    Router.push(`/t/${mainTag}`);
  }

  //子标签点击
  subTagClick = (subTag) => {
    const { mainTag } = this.state.filter;
    Router.push(`/t/${mainTag}/${subTag}`);
  }

  //获取筛选器
  getNewTagList = (taglist) => {
    let taglistMap = new Map();
    let mainTagList = [];
    taglist.forEach(item => {
      if(item.type == 'main'){
        taglistMap.set(item.slug, [])
        mainTagList.push(item);
      }
    });
    taglist.forEach(item => {
      if(item.type == 'sub'){
        let subList = taglistMap.get(item.tagpath) || [];
        subList.push(item)
      }
    })
    return {
      taglistMap,
      mainTagList
    }
  }

  render() {
    const { taglist, sort } = this.props.global
    const { filter, list, loading, hasMore } = this.state
    const { taglistMap, mainTagList } = this.getNewTagList(taglist);
    const { mainTag, subTag } = filter;
    let subTagList = [];
    if(mainTag && taglistMap.get(mainTag)){
      subTagList = taglistMap.get(mainTag);
    }
    return (
      <div>
        <PageHead title="论坛-首页"></PageHead> 

        <ul className="index-filter-tab">
          {mainTagList.map((data, index) => (
            <li 
              className={`index-filter-tab-item ${mainTag == data.slug ? 'current' : ''}`} 
              key={index} 
              onClick={() => this.mainTagClick(data.slug)}>{data.name}</li>
          ))}
        </ul>

        {mainTag && subTagList.length > 0 &&
          <div className="index-filter-tab">
            {subTagList.map(tag => (
              <CheckableTag
                key={tag.slug}
                checked={subTag == tag.slug}
                onChange={checked => this.subTagClick(tag.slug)}
              >
                {tag.name}
              </CheckableTag>
            ))}
          </div>
        }

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
