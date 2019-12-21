import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/index.less'
import { getHomeList } from '../api'
import InfiniteScroll from 'react-infinite-scroller'
import { List, Spin, Divider, Tag } from 'antd'
const { CheckableTag } = Tag;

@inject('global')
@observer
class Index extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }
  constructor() {
    super()
    this.state = {
      filter: {
        tag: '',
        sort: 1,
        page: 1,
        subTag: ''
      },
      list: [],
      loading: false,
      hasMore: true,
    }
  }

  componentDidMount() {
    this.getPostList()
  }

  // 搜索
  chooseFilter = (type, key) => {
    // 重置第一页
    this.setState({ 
      filter: { 
        ...this.state.filter, 
        page: 1,  
        [type]: key
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
        if(this.state.filter.page == 1){
          this.setState({
            list: res
          })
        }else{
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
  };
  
  mainTagClick = (slug) => {
    this.setState({tag: slug})
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
    let subTagList = filter.tag ? taglistMap.get(filter.tag) : [];
    return (
      <div>
        <PageHead title="论坛-首页"></PageHead> 

        <ul className="index-filter-tab">
          {mainTagList.map((data, index) => (
            <li 
              className={`index-filter-tab-item ${filter.tag == data.slug ? 'current' : ''}`} 
              key={index} 
              onClick={() => this.chooseFilter('tag', data.slug)}>{data.name}</li>
          ))}
        </ul>

        {filter.tag && subTagList.length > 0 &&
          <div className="index-filter-tab">
            {subTagList.map(tag => (
              <CheckableTag
                key={tag.slug}
                checked={filter.subTag == tag.slug}
                onChange={checked => this.chooseFilter('subTag', tag.slug)}
              >
                {tag.name}
              </CheckableTag>
            ))}
          </div>
        }

        <div className="index-filter-tab">
          {Object.keys(sort).length && (
            Object.keys(sort).map((k, i) => (
              <li className={`index-filter-tab-item ${filter.sort == k ? 'current' : ''}`} key={i} onClick={() => this.chooseFilter('sort', k)}>{sort[k]}</li>
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
