import React, { Component } from 'react'
import './index.less'

class CommentItem extends Component {
  render() {
    return (
      <div className="comment-item">
        <img src="/static/user-test.png" alt="用户头像" className="comment-user-img"/>
        <div className="comment-content">
          <p className="comment-content-username">澹台</p>
          <p className="comment-content-desc">写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。写的很棒。</p>
          <p className="comment-content-date">20小时前</p>
        </div>
      </div>
    )
  }
}

export default CommentItem