import React, { Component } from 'react'
import { Icon, Button, Upload, message } from 'antd'
import {observer, inject} from 'mobx-react';
import { uploadAvatar } from '../../api'
import './index.less'

function getToken () {
  try {
    return {
      token: localStorage['token'] || '' 
    }
  } catch (e) {
    return {
      token: ''
    }
  }
}

@inject('user')
@observer
class SettingItem extends Component {
  state = {
    tempCon: '',            // 过度内容
    inputStatus: false,     // 输入框状态 false-未聚焦  true-聚焦
  }

  componentDidMount() {
    // saveInput 模式
    if (this.props.type === 'saveInput') {
      this.props.user.getUserInfoDetail().then(() => {
        this.setState({
          tempCon: this.props.user[this.props.sign]
        })
      })
    }
  }

  // 输入框操作
  handleInput = (e) => {
    const { user, sign } = this.props
    if (this.props.type === 'saveInput') {
      this.setState({ tempCon: e.target.value })
    } else if (this.props.type === 'input') {
      user.setState({ [sign]: e.target.value })
    }
  }

  /** saveInput */

  // 更改状态
  changeState = status => {
    const { tempCon } = this.state
    const { sign, user } = this.props
    if (!status && tempCon !== user[sign]) {
      return ;
    }
    this.setState({ inputStatus: status })
  }

  // 取消
  cancel = () => {
    const { sign, user } = this.props
    this.setState({
      tempCon: user[sign],
      inputStatus: false
    })
    this.refs.input.blur()
  }

  // 保存
  save = () => {
    this.props.user.updateUserInfoDetail({bio: this.state.tempCon}).then(res => {
      this.changeState(false)
    })
  }

  // 修改
  edit = () => {
    this.refs.input.focus()
  }

  /** upload */
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  imgChange = (res) => {
    if(res.file.status === 'done') {
      this.props.user.setState({
        avatar: res.file.response.url
      })
    }
  }

  render() {
    const {
      children,
      type,
      placeholder,
      label,
      sign,
      user
    } = this.props
    return (
      <div className={`${type === 'upload' ? 'setting-upload-item' : ''} setting-item`}>
        <span className="setting-item-label">{label}</span>
        {type === 'upload' && (
          <>
            <img src={user[sign]} className="setting-upload-show"/>
            <Upload
              name="file"
              className="setting-upload"
              showUploadList={false}
              action={uploadAvatar}
              headers={getToken()}
              beforeUpload={this.beforeUpload}
              onChange={this.imgChange}
            >
              <Button type="primary">上传</Button>
            </Upload>
            <span className="setting-upload-tip">支持 jpg、png 格式大小 2M 以内的图片</span>
          </>
        )}

        {type === 'input' && (
          <>
            <input 
              type='password'
              className="setting-item-input" 
              placeholder={placeholder}
              value={user[sign]}
              onChange={this.handleInput}
            />
            {children}
          </>
        )}

        {type === 'saveInput' && (
          <>
            <input 
              ref='input'
              value={this.state.tempCon}
              onChange={this.handleInput}
              onFocus={() => this.changeState(true)}
              onBlur={() => this.changeState(false)}
              type="text"
              placeholder={placeholder}
              className="setting-item-input"
            />
            <div className="setting-item-action">
              {!this.state.inputStatus && (
                <div className="setting-item-action-edit">
                  <Button type="link" onClick={this.edit}>
                    <Icon type="edit" />
                    <span>修改</span>
                  </Button>
                </div>
              )}
              {this.state.inputStatus && (
                <div className="setting-item-action-edit">
                  <Button type="link" onClick={this.save}>保存</Button>
                  <Button type="link" onClick={this.cancel}>取消</Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }  
}

export default SettingItem

