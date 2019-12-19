import React from 'react'
import {observer, inject} from 'mobx-react';
import { Button, Input, Affix, Badge, Icon } from 'antd'
import PageHead from '../components/PageHead'
import CommentItem from '../components/CommentItem'
import { getBoardDetail } from '../api'
import '../assets/pageStyle/detail.less'

@inject('global', 'detail')
@observer
class Home extends React.Component{
  static async getInitialProps ({ctx:{query}}) {
    return {slug:query};
  }

  constructor() {
    super()
    this.state = {
      commentBtn: false,
      commentContent: ''
    }
  }

  componentDidMount() {
    this.getBoardDetail();
  }

  commentBtnShow = (flag) => {
    this.setState({ commentBtn: flag })
  }

  commentChange = (e) => {
    this.setState({
      commentContent: e.target.value
    })
  }
  
  // 滚动到评论位置
  goCommnet = () => {
    window.scrollTo(0, document.getElementById('detail-comment').offsetTop)
  }

  //获取帖子详情
  getBoardDetail = () => {
    const { slug } = this.props;
    getBoardDetail({ postslug: slug }).then(res => {
      this.setState({
        ...this.state,
        ...res
      })
    })

  }
  render() {
    const { 
      commentBtn, 
      commentContent, 
      title,
      user,
      image
    } = this.state
    const { commentList, commentTotal, commentLoading } = this.props.detail
    return (
      <>
        <PageHead title="论坛-文章详情"></PageHead>
        <div className="detail-wrapper">
            <Affix offsetTop={100}>
              <div className="detail-action">
                <div className="detail-action-like">
                  <Badge count={86} overflowCount={99} style={{ backgroundColor: '#52c41a' }}>
                    <Icon type="like" />
                  </Badge>
                </div>
                <div className="detail-action-comment" onClick={this.goCommnet}>
                  <Badge count={53} overflowCount={99} style={{ backgroundColor: '#52c41a' }}>
                    <Icon type="message" />
                  </Badge>
                </div>
              </div>
            </Affix>
          <div className="detail-info">
            <div className="detail-user">
              <img src={user && user.avatar} alt="作者头像" className="detail-user-img"/>
              <div className="detail-user-info">
                <p className="detail-user-name">{user && user.username}</p>
                <p className="detail-user-date">
                  <span>2019年11月26日</span>
                <span className="detail-user-read">阅读量 {user && user.activate}</span>
                </p>
              </div>
            </div>
            <div className="detail-cover">
              <img src={image ? image : '/static/logo.png'} alt="文章封面图"/>
            </div>
            <h4 className="detail-title">{title}</h4>
          </div>
          <div className="detail-content">
            <p>1111</p>
            <p>2222</p>
            <p>2222</p>
            <p>2222</p>
            <p>2222</p>
            <p>2222</p>
            <p>2222</p>
            <p>2222</p>
          </div>
          <div className="detail-comment">
            <h6 className="detail-comment-title" id="detail-comment">评论</h6>
            <div className="detail-comment-self">
              <div className="detail-comment-self-content">
                <img src="/static/user-test.png" alt="用户头像" className="detail-comment-self-content-user"/>
                <Input.TextArea
                  value={commentContent}
                  size="large"
                  onFocus={() => this.commentBtnShow(true)}
                  onBlur={() => this.commentBtnShow(false)}
                  className="detail-comment-self-content-areatext"
                  autoSize={{minRows: 1}}
                  onChange={this.commentChange}
                  placeholder="输入评论...">
                </Input.TextArea>
              </div>
              {(commentBtn || commentContent) && (
                <div className="detail-comment-self-submit">
                  <Button type="primary">评论</Button>
                </div>
              )}
            </div>
            <div className="detail-comment-list">
              {commentList.length && (
                commentList.map((data, index) => (
                  <CommentItem data={data} key={index}></CommentItem>
                ))
              )}
            </div>
            <div className="detail-comment-loadmore">
              <Button>加载更多</Button>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Home
