import React, {Component} from 'react'
import { Form, Icon, Input, Button  } from 'antd'
import './login.less'

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入密码"
              />,
            )}
          </Form.Item>
          <Button type="primary" onClick={this.handleSubmit} size="large" className="login-btn">
            登录
          </Button>
          <div className="login-other">
            <div className="left">
              <span>没有账号?</span>
              <span className="reg">注册</span>
            </div>
            <div className="right">
              <span className="forget">忘记密码</span>
            </div>
          </div>
        </Form>
      </>
    )
  }
}

const LoginForm = Form.create({ name: 'login' })(Login);

export default LoginForm