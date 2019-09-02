import React, {Component} from 'react'
import { Modal } from 'antd'
import './login.less'
import Login from './Login'
import Register from './Register'
import Forget from './Forget'

class Index extends Component {
  state = {
    type: 'register'
  }

  render() {
    const { type } = this.state

    return (
      <>
        <Modal
          wrapClassName="login-modal"
          style={{
            top: "25vh"
          }}
          maskStyle={{
            background: "rgba(0, 0, 0, 0.4)"
          }}
          width={318}
          footer={null}
          title="注册"
          visible={true}
          okText="确认"
          cancelText="取消"
        >
          {type == 'login' && <Login></Login>}
          {type == 'register' && <Register></Register>}
          {type == 'forget' && <Forget></Forget>}
        </Modal>
      </>
    )
  }
}

export default Index