import React from 'react'
import {observer, inject} from 'mobx-react';
import { Tabs, Icon } from 'antd';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import{userHomeList,userHomeInfo} from '../api'
import '../assets/pageStyle/user.less'

const { TabPane } = Tabs;

@observer
class User extends React.Component{
  static async getInitialProps ({ ctx }) {
    //console.log(ctx.query)
    const {list:list1,total:total1}= await userHomeList({userslug:ctx.query,type:"post"})
    const {list:list2,total:total2}= await userHomeList({userslug:ctx.query,type:"up"})
    const userinfo=await userHomeInfo({userslug:ctx.query,type:"info"})
    return { list1,total1,list2,total2,userinfo};
  }

 
  constructor(props) {
    super(props)
    console.log(props)
  }

  render() {
    const {list1,list2,userinfo} = this.props;
    //console.log(userinfo)
console.log(typeof list)
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
            <img src={userinfo.avatar} className="user-avatar"/>
            <div className="user-desc">
              <p className="user-desc-name">{userinfo.username}</p>
              <p className="user-desc-desc"><Icon type="contacts" />{userinfo.bio}</p>
            </div>
          </div>
          <div className="user-article">
            <Tabs defaultActiveKey="1" >
              <TabPane tab="发帖" key="1">
                {list1.map((data, index) => (
                  <ListItem data={data} key={index}></ListItem>
                ))}
              </TabPane>
              <TabPane tab="点赞" key="2">
                {list2.map((data, index) => (
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
