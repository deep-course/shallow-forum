import React from 'react'
import {observer, inject} from 'mobx-react';
import { Button, Input, Affix, Badge, Icon } from 'antd'
import PageHead from '../components/PageHead'
import CommentItem from '../components/CommentItem'
import '../assets/pageStyle/detail.less'

@inject('user', 'detail')
@observer
class Home extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }

  constructor() {
    super()
    this.state = {
      commentBtn: false,
      commentContent: ''
    }
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

  render() {
    const { commentBtn, commentContent } = this.state
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
              <img src="/static/user-test.png" alt="作者头像" className="detail-user-img"/>
              <div className="detail-user-info">
                <p className="detail-user-name">澹台</p>
                <p className="detail-user-date">
                  <span>2019年11月26日</span>
                  <span className="detail-user-read">阅读量 17502</span>
                </p>
              </div>
            </div>
            <div className="detail-cover">
              <img src="/static/logo.png" alt="文章封面图"/>
            </div>
            <h4 className="detail-title">《吐血整理》-顶级程序员工具集</h4>
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
