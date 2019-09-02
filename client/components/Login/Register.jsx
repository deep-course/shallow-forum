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


  phoneValidFunction = (rule, value, callback) => {
    /^1[0-9]{10}$/.test(value) && callback()
    callback('请输入正确手机号')
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item hasFeedback>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: '请输入用户名!' },
                { pattern: /[a-zA-Z0-9]{8,30}/, message: '用户名只能包含数字和字母（8-30位）!' },
              ],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入用户名"
                maxLength={30}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('userphone', {
              rules: [
                { required: true, message: '请输入手机号!' },
                { pattern: /^1[0-9]{10}$/, message: '请输入正确手机号!' },
              ],
            })(
              <Input
                size="large"
                prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入手机号"
                maxLength={11}
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