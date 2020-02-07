import React from 'react'
import {inject, observer} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import TagList from '../components/TagList'
import '../assets/pageStyle/index.less'
import {getHomeList} from '../api'
import InfiniteScroll from 'react-infinite-scroller'
import {Divider, List, Spin} from 'antd'
import {getTitle} from '@utils/page'
import nookies from 'nookies'

@inject('boardSetting',  "currentUser")
@observer
class Index extends React.Component {
    static async getInitialProps({ctx}) {
        //这里写服务端的初始化代码，就是ssr第一次首屏现实的东西
        //nookies获取cookies信息
        const cookies = nookies.get(ctx)
        //console.log(ctx);
        const {list: postlist, total} = await getHomeList({
            sort: 1,
            page: 1,
        }, cookies);

        return {postlist, total};
    }

    constructor(props) {
        super(props)
        this.state = {
            filter: {
                sort: 1,
                page: 1,
            },
            list: props.postlist,
            loading: false,
            finish: true,
            hasMore: true,
        }

    }

    componentDidMount() {
        //这里写客户端的初始化代码

        //console.log(this.state);
        //this.chooseFilter({sort: 1})
        //this.props.boardSetting.initialData()


        //console.log(this.props)
    }

    // 搜索
    chooseFilter = (obj) => {
        // 重置第一页
        this.setState({
            filter: {
                ...this.state.filter,
                page: 1,
                ...obj
            }
        })
        setTimeout(() => {
            this.getPostList(true)
        })
    }

    // 获取帖子列表
    getPostList = (clear = false) => {
        this.setState({loading: true})
        getHomeList(this.state.filter).then(res => {
            if (res.list.length > 0) {
                if (clear) {
                    this.setState({
                        list: [...res.list],
                    })
                } else {
                    this.setState({
                        ...this.state,
                        list: [...this.state.list, ...res.list],
                    })
                }

            } else {
                // 无结果 已加载全部
                this.setState({hasMore: false})
            }
            this.setState({loading: false})  
            
            
        }, () => {
            this.setState({loading: false})
        })
    }

    //无限滚动加载
    handleInfiniteOnLoad = (page) => {
       
        this.setState({loading: true})

        if (page > 10) {
            this.setState({hasMore: false})
        }
        this.setState({
            filter: {
                ...this.state.filter,
                page,
                loading: false,
            }
        })
        setTimeout(() => {
            this.getPostList()
        })
    }


    render() {
        //console.log(this.state)
        const {sort, taglist} = this.props.boardSetting
        const {filter, list, loading, hasMore, total} = this.state
        const loader = <div key="loading" className="demo-loading-container" key="none"><Spin/></div>;
        const pageTitle=getTitle("home","");
        return (
            <div>
                <PageHead title={pageTitle}></PageHead>

                <TagList taglist={taglist}></TagList>

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
                    <InfiniteScroll
                        //initialLoad={false}
                        pageStart={1}
                        loader={loader}
                        loadMore={this.handleInfiniteOnLoad}
                        hasMore={!loading && hasMore}
                    >
                        <List
                            dataSource={list}
                            renderItem={(item, index) => {
                                if (item) {
                                    return <ListItem data={item} index={index} key={index}></ListItem>
                                } else {
                                    return <li>未找到</li>
                                }
                            }
                            }
                        >

                            {!hasMore && (
                                <Divider key="none">到底了</Divider>
                            )}
                        </List>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}

export default Index
