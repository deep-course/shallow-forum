import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/index.less'
import { getPostList } from '../api'

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
        tag: 'tag1',
        sort: 1,
        page: 1,
      },
      list: [],
      loading: false,
      finish: false,
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
    this.setState({loading: true, finish: false})
    getPostList(this.state.filter).then(res => {
      console.log(res)
      if (res.length) {
        // 有返回结果
        if (this.state.filter.page == 1) {
          // 首次加载
          this.setState({list: res})
        } else {
          // 翻页
          this.setState({list: [...this.state.list, ...res]})
        }
      } else {
        // 无结果 已加载全部
        this.setState({finish: true})
      }
      this.setState({loading: false})
    }, () => {
      this.setState({loading: false})
    })
  }

  render() {
    const { taglist, sort } = this.props.global
    const { filter, list, loading } = this.state
    return (
      <div>
        <PageHead title="论坛-首页"></PageHead>
        <ul className="index-filter-tab">
          {Object.keys(taglist).length && (
            Object.keys(taglist).map((k, i) => (
              <li className={`index-filter-tab-item ${filter.tag == k ? 'current' : ''}`} key={i} onClick={() => this.chooseFilter('tag', k)}>{taglist[k]}</li>
            ))
          )}
        </ul>
        <div className="index-filter-tab">
          {Object.keys(sort).length && (
            Object.keys(sort).map((k, i) => (
              <li className={`index-filter-tab-item ${filter.sort == k ? 'current' : ''}`} key={i} onClick={() => this.chooseFilter('sort', k)}>{sort[k]}</li>
            ))
          )}
        </div>
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
