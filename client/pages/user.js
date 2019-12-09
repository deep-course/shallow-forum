import React from 'react'
import {observer, inject} from 'mobx-react';
import { Tabs, Icon } from 'antd';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/user.less'

const { TabPane } = Tabs;

@inject('global')
@observer
class User extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }

  changeTab = (key) => {
  }

  render() {
    const list = [{},{},{}]

    return (
      <>
        <PageHead title="论坛-用户主页"></PageHead>
        {/* <div className="index-list">
          {list.map((data, index) => (
            <ListItem data={data} key={index}></ListItem>
          ))}
        </div> */}
        <div className="user">
          <div className="user-info">
            <img src="/static/user-test.png" className="user-avatar"/>
            <div className="user-desc">
              <p className="user-desc-name">小猪佩种</p>
              <p className="user-desc-desc"><Icon type="contacts" />哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>
            </div>
          </div>
          <div className="user-article">
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab="帖子" key="1">
                {list.map((data, index) => (
                  <ListItem data={data} key={index}></ListItem>
                ))}
              </TabPane>
              <TabPane tab="标题2" key="2">
                {list.map((data, index) => (
                  <ListItem data={data} key={index}></ListItem>
                ))}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </>
    )
  }
}

export default User
