import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import TagList from '../components/TagList'
import '../assets/pageStyle/index.less'
import { getPostList } from '../api'
import { List, Spin, Divider, Tag } from 'antd'
import {Pagination} from 'antd'
import nookies from 'nookies'

@inject('boardSetting')
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
    const {list:postlist,total}=await getPostList({
      sort: 1,
      page: 1,
      tag,
    },cookies);
    return {  postlist ,tag,main,sub,total};
  }
 
  constructor(props) {

    super(props)
    this.state = {
      filter: {
        sort: 1,
        page: 1,
        tag:props.tag
      },
      list: props.postlist,
      total:props.total,
      loading: false,
    }

  }

  componentDidMount() {
    //这里写客户端的初始化代码

  }
  chooseFilter = (obj) => {
    this.setState({ 
      filter: { 
        ...this.state.filter, 
        page: 1,  
        ...obj
      } 
    })
    setTimeout(() => {
      this.onChange(1)
    })
  }
  onChange= (page)=> {

    this.setState({
      filter: {
        ...this.state.filter,
        page: page
      },
      loading:true,
    },()=>{
      getPostList(this.state.filter).then(res=>{
        this.setState({
          ...this.state,
          loading:false,
          list:res.list,
          total:res.total
        })

      })

    })
  }
  render() {
    const {  sort,taglist} = this.props.boardSetting

    const { filter, list, loading ,total} = this.state
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
                  return <li>未找到数据</li>
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
        <Pagination hideOnSinglePage={true} onChange={this.onChange} total={total} pageSize={20} current={filter.page}  />
      </div>
    )
  }
}

export default PostList
