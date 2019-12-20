import React, { Component } from 'react'
import './index.less'

class CommentItem extends Component {
  render() {
    const {
      useravatar,
      username,
      content,
      addtime,
      id
    } = this.props.data;
    return (
      <div className="comment-item">
        <img src={useravatar} alt="用户头像" className="comment-user-img"/>
        <div className="comment-content">
          <p className="comment-content-username">{username}</p>
          <p className="comment-content-desc">{content}</p>
          <p className="comment-content-date">{addtime}</p>
        </div>
      </div>
    )
  }
}

export default CommentItem