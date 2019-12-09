import React from 'react'
import {observer, inject} from 'mobx-react';
import { Tabs, Button } from 'antd';
import PageHead from '../components/PageHead'
import SettingItem from '../components/SettingItem'
import '../assets/pageStyle/setting.less'


const { TabPane } = Tabs;

@inject('global', 'user')
@observer
class Setting extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }

  changeTab = (key) => {
  }

  // 标题dom
  title = (title) => {
    return (
      <div className="setting-title">{title}</div>
    )
  }

  handleInput = (e, key) => {
    this.setState({ [key]: e.target.value })
  }

  render() {
    return (
      <>
        <PageHead title="论坛-个人设置"></PageHead>
        <div className="setting">
          <Tabs defaultActiveKey="1" onChange={this.changeTab}>
            <TabPane tab="个人资料" key="1">
              {this.title('个人资料')}
              <SettingItem label="头像" type="upload" sign="avatar"></SettingItem>
              <SettingItem label="个人介绍" placeholder="填写你的介绍" type="saveInput" sign="bio"></SettingItem>
            </TabPane>
            <TabPane tab="修改密码" key="2">
              {this.title('修改密码')}
              <SettingItem label="旧密码" placeholder="请输入原密码" type="input" sign="oldPassword">
                <Button type="link">忘记密码</Button>
              </SettingItem>
              <SettingItem label="新密码" placeholder="请输入新密码" type="input" sign="newPassword"></SettingItem>
              <SettingItem label="确认新密码" placeholder="确认新密码" type="input" sign="confirmPassword"></SettingItem>
              <div className="setting-submit"><Button type="primary" onClick={this.props.user.updatePassword}>保存修改</Button></div>
            </TabPane>
          </Tabs>
        </div>
      </>
    )
  }
}

export default Setting
