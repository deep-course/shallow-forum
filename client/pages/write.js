import React from 'react'
import {Badge, Button, Drawer, Icon, message, Tag, Upload} from 'antd'
import marked from 'marked'
import highlight from 'highlight.js'
import axios from 'axios'
import Router from 'next/router'
import {inject, observer} from 'mobx-react'
import PageHead from '../components/PageHead'
import User from '../components/User'
import {boardDeleteImg, boardUploadImg, publishNewPost, getImgList} from '../api'
import {getToken} from '@utils/cookie';
import {getTitle} from '@utils/page'
import '../assets/pageStyle/write.less'
import {action} from "mobx";

const {CheckableTag} = Tag;

highlight.configure({
    tabReplace: '  ',
    classPrefix: 'hljs-',
    languages: ['CSS', 'HTML, XML', 'JavaScript', 'PHP', 'Python', 'Stylus', 'TypeScript', 'Markdown']
})
const renderer = new marked.Renderer();
renderer.heading = (text, level, raw) => {
    // const id = raw.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-');
    return `<h${level}>${text}</h${level}>\n`;
};
marked.setOptions({
    highlight(code) {
        return highlight.highlightAuto(code).value
    }
})

// 获取写入区域
const getWriteArea = () => {
    return document.querySelector('.write-wrapper')
}

@inject('boardSetting', "currentUser")
@observer
class Write extends React.Component {
    constructor(props) {

        super(props)
        //console.log(props.labellist)
        this.state = {
            // 发布相关
            post: {
                title: '',
                labelid: '',
                tags: '',
                imagelist: [],
                mainimage: '',
                boardid: 0,
                content: '',      // 转换的dom内容
                selectedTags: []
            },
            contentImgShow: false,
            confirmShow: false,

            contentLoading: false,
            mainLoading: false,
        }
        this.cacheValue()
    }

    componentDidMount() {
        getImgList({}).then(res => {
            this.setState({
                post: {
                    ...this.state.post,
                    imagelist: [...res]
                }
            })
        })
        // getWriteArea().innerText='asdasdasda'

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

    // markdown转换
    onContentChange = (e) => {
        this.setState({
            post: {
                ...this.state.post,
                content: marked(e.target.innerText, {
                    breaks: true,
                    renderer
                })
            }
        })
        !this.hasContentChanged && (this.hasContentChanged = true)
    }

    // 手动markdown转换
    onHandleContentChange = () => {
        const target =  document.querySelector('.write-wrapper')
        this.setState({
            post: {
                ...this.state.post,
                content: marked(target.innerText, {
                    breaks: true,
                    renderer
                })
            }
        })
        !this.hasContentChanged && (this.hasContentChanged = true)
    }

    setScrollValue = () => {
        // 设置值，方便 scrollBy 操作
        this.scale = (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) / (this.editWrap.offsetHeight - this.editContainer.offsetHeight)
        this.hasContentChanged = false
    }

    // 拖拽后上传
    handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (this.beforeUpload(file)) {
            const fd = new FormData();
            fd.append('file', file);
            axios.defaults.withCredentials = true
            axios({
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getToken(),
                },
                url: boardUploadImg,
                data: fd
            }).then(res => {
                this.setState({
                    post: {
                        ...this.state.post,
                        imagelist: [...this.state.post.imagelist, res.data.data.url]
                    }
                })
                getWriteArea().innerText += `\n![内容图片](${res.data.data.url})`
                this.onHandleContentChange()
            })
        }
    }

    // 输入标题
    handleTitle = e => {
        this.setState({post: {...this.state.post, title: e.target.value}})
    }

    // 操作抽屉框
    operaDrawer = (key, flag) => {
        this.setState({[key]: flag})
    }

    // 选择发布类型
    chooseType = (key, type) => {
        const {tags} = this.state.post;
        this.setState({
            post: {
                ...this.state.post,
                [type]: key
            }
        })
        setTimeout(() => {
            if (type == "tags" && key != tags) {
                this.chooseType([], "selectedTags");
            }
        })
    }

    // 上传前置校验
    beforeUpload = (file, type) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 文件!');
            return ;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('图片大小不能超过 5MB!');
            return ;
        }
        this.setState({ [type]: true })
        return isJpgOrPng && isLt5M;
    }

    // 图片上传回调
    imgChange = (res, type) => {
        if (res.file.status === 'done') {
            if (type === 'content') {
                // 如果是文章内容图片
                this.setState({
                    post: {
                        ...this.state.post,
                        imagelist: [...this.state.post.imagelist, res.file.response.data.url]
                    },
                    contentLoading: false,
                })
                // 插入图片
                getWriteArea().innerText += `\n![内容图片](${res.file.response.data.url})`
                this.onHandleContentChange()
            } else if (type === 'mainimage') {
                // 如果是主图
                this.setState({
                    post: {
                        ...this.state.post,
                        mainimage: res.file.response.data.url,
                        imagelist: [...this.state.post.imagelist, res.file.response.data.url]
                    },
                    mainLoading: false,
                })
            }
        }
    }
    @action
    deleteImg = (fileurl) => {
        boardDeleteImg({fileurl}).then(res => {
            console.log(res)
            message.info("删除成功")
        })
    }
    // 删除内容图片
    deleteContentImg = (url, index) => {
        this.setState({post: {...this.state.post, mainimage: ''}})
        let temp = this.state.post.imagelist

        // 删除编辑区图片信息
        const deleteImgUrl = `![内容图片](${temp[index]})`
        const target =  document.querySelector('.write-wrapper')
        target.innerText = target.innerText.replace(deleteImgUrl, '')

        const mainTempImgUrl = temp[index]
        temp.splice(index, 1)
        this.setState({post: {...this.state.post, imagelist: temp, mainimage: mainTempImgUrl === this.state.post.mainimage ? '' : this.state.post.mainimage}})
        setTimeout(() => {
            this.onHandleContentChange()
        }, 0)
        this.deleteImg(url)
    }

    // 删除主图
    deleteMainimageImg = () => {
        // this.deleteImg(this.state.post.mainimage)
        this.setState({post: {...this.state.post, mainimage: ''}})
    }

    // 更换主图
    chooseMainImg = url => {
        this.setState({post: {...this.state.post, mainimage: this.state.post.mainimage === url ? '' : url}})
    }

    // 发布帖子
    publish = () => {
        const {title, content, tags, labelid, selectedTags} = this.state.post
        if (!title) {
            message.error('请输入标题')
            return;
        }
        if (!content) {
            message.error('请输入内容')
            return;
        }
        if (!tags) {
            message.error('请选择分类')
            return;
        }
        if (!labelid) {
            message.error('请选择标签')
            return;
        }
        let newTags = [tags, ...selectedTags];
        newTags = newTags.join();
        this.state.post.tags = newTags;
        publishNewPost(this.state.post).then(res => {
            message.success('发布成功！')
            setTimeout(() => {
                Router.replace('/')
            }, 1000)
        })
    }

    //获取筛选器
    getNewTagList = () => {
        let taglistMap = new Map();
        let mainTagList = [];
        this.props.boardSetting.taglist.forEach(item => {
            if (item.type == 'main') {
                taglistMap.set(item.slug, [])
                mainTagList.push(item);
            }
        });
        this.props.boardSetting.taglist.forEach(item => {
            if (item.type == 'sub') {
                let subList = taglistMap.get(item.tagpath) || [];
                subList.push(item)
            }
        })
        return {
            taglistMap,
            mainTagList
        }
    }

    handleChangeSelectedTags = (tag, checked) => {
        const {selectedTags} = this.state.post;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        if (nextSelectedTags.length > 2) {
            message.error('子标签不能超过2个');
            return;
        }
        this.chooseType(nextSelectedTags, "selectedTags")
    }

    render() {

        //
        const {confirmShow, contentImgShow, contentLoading, mainLoading} = this.state
        const {title, labelid, tags, imagelist, mainimage, boardid, content, selectedTags} = this.state.post
        const {labellist} = this.props.boardSetting
        const {taglistMap, mainTagList} = this.getNewTagList();
        let subTagList = [];
        if (tags && taglistMap.get(tags)) {
            subTagList = taglistMap.get(tags);
        }
        const pageTitle=getTitle("page","发布新文章");
        return (
            <>
                <PageHead title={pageTitle}></PageHead>
                <div className="write-container">
                    <div className="title">
                        <input className="input" value={title} onChange={this.handleTitle} type="text"
                            placeholder="请输入标题..."/>
                        <Button type="primary" onClick={() => this.operaDrawer('confirmShow', true)}>下一步：设置属性</Button>
                        <User></User>
                    </div>
                    <div className="content">
                        <div
                            onDragOver={this.preventDefault}
                            onDragEnter={this.preventDefault}
                            onDrop={this.handleDrop}
                            onMouseOver={this.setCurrentIndex.bind(this, 1)}
                            onScroll={this.containerScroll}
                            ref={node => this.editContainer = node}
                            className="write">
                            <div
                                value={'asdasdasd'}
                                onInput={this.onContentChange}
                                ref={node => this.editWrap = node}
                                className="write-wrapper"
                                contentEditable="plaintext-only">
                            </div>
                        </div>
                        <div
                            ref={node => this.previewContainer = node}
                            onMouseOver={this.setCurrentIndex.bind(this, 2)}
                            onScroll={this.containerScroll}
                            className="show markdown-body">
                            <div
                                ref={node => this.previewWrap = node}
                                className="show-wrapper"
                                dangerouslySetInnerHTML={{__html: content}}>
                            </div>
                        </div>
                    </div>
                    <div className="options">
                        <Upload
                            name="file"
                            showUploadList={false}
                            action={boardUploadImg}
                            headers={getToken()}
                            beforeUpload={file => this.beforeUpload(file, 'contentLoading')}
                            onChange={res => this.imgChange(res, 'content')}>
                            {
                                contentLoading && (<Icon type="loading"  className="upload-img upload-entry"/>)
                            }
                            {
                                !contentLoading && (<Icon type="file-image" className="upload-img upload-entry"/>)
                            }
                            <span className="upload-entry">上传图片</span>
                        </Upload>
                        {!!imagelist.length && (
                            <Badge count={imagelist.length}>
                                <Button className="write-manage-content-img" type="primary"
                                        onClick={() => this.operaDrawer('contentImgShow', true)}>管理上传图片</Button>
                            </Badge>
                        )}
                        <Drawer
                            title="上传图片列表"
                            placement="left"
                            closable={false}
                            onClose={() => this.operaDrawer('contentImgShow', false)}
                            visible={contentImgShow}
                        >
                            <div className="write-content-img-wrapper">
                                {imagelist.map((v, i) => (
                                    <div className={v === mainimage ? 'write-content-img-item-main write-content-img-item' : 'write-content-img-item'} key={i}>
                                        <Icon type="delete" className="write-delete-content-img"
                                            onClick={() => this.deleteContentImg(v, i)}/>
                                        {
                                            v === mainimage && (<span className="write-delete-content-img-main-tip">封面主图</span>)
                                        }
                                        <img src={v}/>
                                    </div>
                                ))}
                            </div>
                        </Drawer>
                    </div>
                    <Drawer
                        width="400"
                        title="发布文章"
                        placement="right"
                        className="write-confirm-wrapper"
                        closable={false}
                        onClose={() => this.operaDrawer('confirmShow', false)}
                        visible={confirmShow}>
                        <div className="write-cover write-block">
                            <h5 className="write-drawer-title">上传封面图</h5>
                            <div className="clearfix">
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    action={boardUploadImg}
                                    headers={getToken()}
                                    beforeUpload={file => this.beforeUpload(file, 'mainLoading')}
                                    onChange={res => this.imgChange(res, 'mainimage')}>
                                    {!mainimage && (
                                        <div className="write-upload-cover">
                                            {
                                                mainLoading && ( <Icon type="loading"/>)
                                            }
                                            {
                                                !mainLoading && (<span>点击此处添加封面图片</span>)
                                            }
                                        </div>
                                    )}
                                </Upload>
                                {!!mainimage && (
                                    <div className="write-mainimage-wrapper">
                                        <Icon type="delete" className="write-delete-mainimage-img"
                                            onClick={this.deleteMainimageImg}/>
                                        <img src={mainimage} className="write-mainimage"/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="write-type write-block">
                            <h5 className="write-drawer-title">分类</h5>
                            <ul className="write-type-list">
                                {mainTagList.map((data, index) => (
                                    <li
                                        className={`write-type-list-item ${tags == data.slug ? 'current' : ''}`}
                                        key={index}
                                        onClick={() => this.chooseType(data.slug, "tags")}>{data.name}</li>
                                ))}
                            </ul>
                            <ul className="write-type-list">
                                {subTagList.map(tag => (
                                    <CheckableTag
                                        key={tag.slug}
                                        checked={selectedTags.indexOf(tag.slug) > -1}
                                        onChange={checked => this.handleChangeSelectedTags(tag.slug, checked)}
                                    >
                                        {tag.name}
                                    </CheckableTag>
                                ))}
                            </ul>
                        </div>
                        <div className="write-label write-block">
                            <h5 className="write-drawer-title">标签</h5>
                            <ul className="write-type-list">

                                {Object.keys(labellist).length && Object.keys(labellist).map(key => (

                                    <li className={`write-type-list-item ${labelid == key ? 'current' : ''}`} key={key}
                                        onClick={() => this.chooseType(key, 'labelid')}>{labellist[key]}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="write-submit">
                            <Button type="primary" onClick={this.publish}>确认并发布</Button>
                        </div>
                    </Drawer>
                </div>
            </>
        )
    }
}

export default Write