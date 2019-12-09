import React, { Component } from 'react'
import { Button, Icon, Drawer, Upload, Modal } from 'antd'
import marked from 'marked'
import highlight from 'highlight.js'
import { observer, inject } from 'mobx-react'
import PageHead from '../components/PageHead'
import User from '../components/User'
import '../assets/pageStyle/write.less'

highlight.configure({
  tabReplace: '  ',
  classPrefix: 'hljs-',
  languages: ['CSS', 'HTML, XML', 'JavaScript', 'PHP', 'Python', 'Stylus', 'TypeScript', 'Markdown']
})
marked.setOptions({
  highlight (code) {
    return highlight.highlightAuto(code).value
  }
})

// base64转化
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

@inject('global', 'write')
@observer
class Write extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewContent: '',
      confirmShow: false,

      previewVisible: false,
      previewImage: '',
      fileList: [],
      
      // 发布相关
      lableid: '',
      tags: '',
    }
    this.cacheValue()
  }

  componentDidMount() {
    this.props.write.getBoardSet()
  }

  cacheValue = () => {
    this.currentTabIndex = 1
    this.hasContentChanged = false
    this.scale = 1
  }

  setCurrentIndex = (index) => {
    this.currentTabIndex = index
  }

  containerScroll = (e) => {
    this.hasContentChanged && this.setScrollValue()
    if (this.currentTabIndex === 1) {
      this.previewContainer.scrollTop = this.editContainer.scrollTop * this.scale
    } else {
      this.editContainer.scrollTop = this.previewContainer.scrollTop / this.scale
    }
  }

  onContentChange = (e) => {
    this.setState({
      previewContent: marked(e.target.innerText, {breaks: true})
    })
    !this.hasContentChanged && (this.hasContentChanged = true)
  }

  setScrollValue = () => {
    // 设置值，方便 scrollBy 操作
    this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) / (this.editWrap.offsetHeight - this.editContainer.offsetHeight)
    this.hasContentChanged = false
  }

  // todo 拖拽后上传
  handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    console.log(file)
  }

  // 上传事件
  imageUpload = () => {

  }

  handleCancel = () => this.setState({ previewVisible: false });
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  handleChange = ({ fileList }) => this.setState({ fileList });

  // 关闭确认发布框
  operaConfirm = (flag) => {
    this.setState({ confirmShow: flag })
  }

  // 选择发布类型
  chooseType = (key, type) => {
    this.setState({[type]: key})
  }


  render() {
    const { previewContent, confirmShow, previewVisible, previewImage, fileList, lableid, tags } = this.state
    const { taglist, laballist } = this.props.write
    const uploadButton = (
      <div className="write-upload-cover">
        <span>点击此处添加封面图片</span>
      </div>
    );
    return (
      <>
        <PageHead title="论坛-发布"></PageHead>
        <div className="write-container">
          <div className="title">
            <input className="input" type="text" placeholder="请输入标题..."/>
            <Button type="primary" onClick={() => this.operaConfirm(true)}>发布</Button>
            <User></User>
          </div>
          <div className="content">
            <div 
              onDragOver={this.preventDefault}
              onDragEnter={this.preventDefault}
              onDrop={this.handleDrop}
              onMouseOver={this.setCurrentIndex.bind(this, 1)}
              onScroll={this.containerScroll}
              ref={node=>this.editContainer=node}
              className="write">
              <div 
                onInput={this.onContentChange}
                ref={node=>this.editWrap=node}
                className="write-wrapper" 
                contentEditable="plaintext-only">
              </div>
            </div>
            <div
              ref={node=>this.previewContainer=node}
              onMouseOver={this.setCurrentIndex.bind(this, 2)}
              onScroll={this.containerScroll}
              className="show markdown-body">
              <div
                ref={node=>this.previewWrap=node}
                className="show-wrapper"
                dangerouslySetInnerHTML={{__html: previewContent}}>
              </div>
            </div>
          </div>
          <div className="options">
            <Icon type="file-image" className="upload-img upload-entry"/>
            <span className="upload-entry">上传图片</span>
          </div>
          <Drawer
            width="400"
            title="发布文章"
            placement="right"
            className="write-confirm-wrapper"
            closable={false}
            onClose={() => this.operaConfirm(false)}
            visible={confirmShow}>
            <div className="write-cover write-block">
              <h5 className="write-drawer-title">上传封面图</h5>
              <div className="clearfix">
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
            </div>
            <div className="write-type write-block">
              <h5 className="write-drawer-title">分类</h5>
              <ul className="write-type-list">
                {Object.keys(taglist).length && Object.keys(taglist).map(key => (
                  <li className={`write-type-list-item ${tags == key ? 'current' : ''}`} key={key} onClick={() => this.chooseType(key, 'tags')}>{taglist[key]}</li>
                ))}
              </ul>
            </div>
            <div className="write-label write-block">
              <h5 className="write-drawer-title">标签</h5>
              <ul className="write-type-list">
                {Object.keys(laballist).length && Object.keys(laballist).map(key => (
                  <li className={`write-type-list-item ${lableid == key ? 'current' : ''}`} key={key} onClick={() => this.chooseType(key, 'lableid')}>{laballist[key]}</li>
                ))}
              </ul>
            </div>
            <div className="write-submit">
              <Button type="primary">确认并发布</Button>
            </div>
          </Drawer>
        </div>
      </>
    )
  }
}

export default Write