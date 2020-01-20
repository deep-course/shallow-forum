import React from 'react'
import {observer, inject} from 'mobx-react';
import { Button, Input, Affix, Badge, Icon, Divider } from 'antd'
import PageHead from '../components/PageHead'
import CommentItem from '../components/CommentItem'
import { getPostDetail, getCommentlist, addNewComment } from '../api'
import moment from 'dayjs'
import '../assets/pageStyle/detail.less'
import nookies from 'nookies'
import {getTitle} from '@utils/page'
@observer
class PostDetail extends React.Component{
  static async getInitialProps ({ctx}) {
    const cookies=nookies.get(ctx)
    const {
      slug = ''
    } = ctx.query;
    const detail= await getPostDetail({postslug:slug},cookies)
    console.log("detail:",detail);
    return { slug, detail };
  }

  constructor(props) {
    super(props)
    const {
      slug,
      detail
    } = props;
    this.state = {
      ...detail,
      slug,
      commentBtn: false,
      commentContent: '',
      commentList: [],
      commentListPage: 1,
      commentBtnMore: true,
    }
  }

  componentDidMount() {
    // this.getBoardDetail();
    this.getCommentlist()
  }

  commentBtnShow = (flag) => {
    this.setState({ commentBtn: flag })
  }

  commentChange = (e) => {
    this.setState({
      commentContent: e.target.value
    })
  }

  //新建回复
  addNewComment = () => {
    const { commentContent } = this.state;
    const { slug } = this.props;
    let params = {
      postslug: slug,
      content: commentContent,
      commentContent: ''
    }
    addNewComment(params).then(data => {
      this.setState({ 
        commentListPage: 1,
        commentList: []
      })
      setTimeout(() => {
        this.getCommentlist()
      })
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

  //获取回复列表
  getCommentlist = () => {
    const { commentListPage } = this.state;
    const { slug } = this.props;
    getCommentlist({ postslug: slug, page: commentListPage }).then(data => {
      if(data && data.length > 0){
        let commentList = this.state.commentList.concat(data);
        this.setState({ commentList })
      }else{
        if(commentListPage != 1){
          this.setState({ commentBtnMore: false })
        }
      }
    })
  }

  //回复列表加载更多
  getMoreCommentlist = () => {
    let { commentListPage } = this.state;
    commentListPage = commentListPage + 1;
    this.setState({ commentListPage })
    setTimeout(() => {
      this.getCommentlist()
    })
  }

  render() {
    const { 
      commentBtn, 
      commentContent, 
      title,
      user,
      image,
      comment,
      commentcount,
      upcount,
      pubtime,
      commentList,
      commentBtnMore
    } = this.state
    const pageTitle=getTitle("post",title);
    return (
      <>
        <PageHead title={pageTitle}></PageHead>
        <div className="detail-wrapper">
            <Affix offsetTop={100}>
              <div className="detail-action">
                <div className="detail-action-like">
                  <Badge count={upcount} overflowCount={99} style={{ backgroundColor: '#52c41a' }}>
                    <Icon type="like" />
                  </Badge>
                </div>
                <div className="detail-action-comment" onClick={this.goCommnet}>
                  <Badge count={commentcount} overflowCount={99} style={{ backgroundColor: '#52c41a' }}>
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
                  <span>{moment(new Date(pubtime)).format('YYYY年MM月DD日')}</span>
                {/* <span className="detail-user-read">阅读量 {user && user.activate}</span> */}
                </p>
              </div>
            </div>
            {/*<div className="detail-cover">
              <img src={image} alt="文章封面图"/>
    </div> */}
            <h4 className="detail-title">{title}</h4>
          </div>
          <div className="detail-content" dangerouslySetInnerHTML={{ __html: comment ? comment.content : ""}}>
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
                  <Button type="primary" onClick={this.addNewComment}>评论</Button>
                </div>
              )}
            </div>
            <div className="detail-comment-list">
              {commentList.length>0 && (
                commentList.map((data, index) => (
                  <CommentItem data={data} key={index}></CommentItem>
                ))
              )}
            </div>
            <div className="detail-comment-loadmore">
              {commentBtnMore ?
                  <Button onClick={this.getMoreCommentlist}>加载更多</Button>
                :
                  <Divider>到底了</Divider>
                }
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default PostDetail
