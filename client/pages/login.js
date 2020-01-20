import React from 'react'
import { Form, Button, Input, Icon, Modal, message } from 'antd'
import Router from 'next/router'
import { observer, inject } from 'mobx-react'
import PageHead from '../components/PageHead'
import { setToken } from '@utils/cookie'
import { login, getCaptcha, register, sendSms, resetSendSms, resetPassword } from '../api'
import '../assets/pageStyle/login.less'
import {getTitle} from '@utils/page'
const { Search } = Input;

// 表单map
const modalMap = {
  login: {
    title: '登录',
    btn: '登录',
    content: [
      { icon: 'user', placeholder: '请输入用户名', maxLength: 30, bind: 'username', rules: [
        { required: true, message: '请输入用户名!' },
      ]},
      { icon: 'lock', placeholder: '请输入密码', maxLength: 30, bind: 'password', type: 'password', rules: [
        { required: true, message: '请输入密码!' }
      ]}
    ],
  },
  register: {
    title: '注册',
    btn: '注册',
    content: [
      { icon: 'user', placeholder: '请输入用户名', maxLength: 30, bind: 'username', rules: [
        { required: true, message: '请输入用户名!' },
        { min: 6, max: 30, pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{6,30}$/, message: '用户名应为6-30位字母或数字或汉字!' },
      ]},
      { icon: 'mobile', placeholder: '请输入手机号', maxLength: 11, bind: 'phone', rules: [
        { required: true, message: '请输入手机号!' },
        { pattern: /^1[0-9]{10}$/, message: '请输入正确手机号!' },
      ]},
      { icon: 'safety-certificate', placeholder: '请输入验证码',  maxLength: 4, bind: 'token', rules: [
        { required: true, message: '请输入验证码!' }
      ]},
      { icon: 'lock', placeholder: '请输入密码', maxLength: 30, bind: 'password', type: 'password', rules: [
        { required: true, message: '请输入密码' },
        { min: 6, max: 30, pattern: /^[a-zA-Z0-9]{6,30}$/, message: '密码应为6-30位字母或数字!' },
      ]}
    ]
  },
  forget: {
    title: '忘记密码',
    btn: '重置密码',
    content: [
      { icon: 'mobile', placeholder: '请输入手机号', maxLength: 11, bind: 'phone', rules: [
        { required: true, message: '请输入手机号!' },
        { pattern: /^1[0-9]{10}$/, message: '请输入正确手机号!' },
      ]},
      { icon: 'safety-certificate', placeholder: '请输入验证码', maxLength: 4, bind: 'token', rules: [
        { required: true, message: '请输入验证码!' }
      ]},
      { icon: 'lock', placeholder: '请输入密码', maxLength: 30, bind: 'password', type: 'password', rules: [
        { required: true, message: '请输入密码' },
        { min: 6, max: 30, pattern: /^[a-zA-Z0-9]{6,30}$/, message: '密码应为6-30位字母或数字!' },
      ]}
    ]
  },
}

let timer;


@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'login',                // form类型key
      title: '登录',                 // form类型name
      modal: false,                 // 验证码弹窗
      captchaImg: '',               // 验证码图片
      captcha: '',                  // 手动输入的验证码
      startTime: '',                // 倒计时触发时打点时间戳
      showTime: '发送验证码'          // 发送验证码倒计时展示
    }
  }

  componentDidMount() {
    //const { loginType, loginTypeName, setState } = this.props.global
    const loginType="", loginTypeName=""
    if (loginType) {
      this.handleChange(loginTypeName, loginType)
      //setState({ loginType: '', loginTypeName: '' })
    }
  }

  // 切换
  handleChange = (title, type) => {
    this.props.form.resetFields()
    this.setState({
      type,
      title
    })
  }


  /**
   * 表单Item生成
   * @param {Object} item  每条item配置信息
   * @param {Number} index 索引key值
   */
  FormItem = (item, index) => {
    const { icon, placeholder, maxLength, bind, rules, type } = item
    const { getFieldDecorator } = this.props.form
    const { showTime } = this.state 
    return (
      bind !== 'token' ? (
        <Form.Item key={index}>
          {getFieldDecorator(bind, {
            rules,
          })(
            <Input
              size="large"
              prefix={<Icon type={icon} style={{ color: '#426799' }} />}
              placeholder={placeholder}
              maxLength={maxLength}
              type={type || 'text'}
            />
          )}
        </Form.Item>
      ) : ((/^1[0-9]{10}$/.test(this.props.form.getFieldValue('phone'))) ? (
        <Form.Item key={index}>
          {getFieldDecorator(bind, {
            rules,
          })(
            <Search
              prefix={<Icon type={icon} style={{ color: '#426799' }} />}
              placeholder={placeholder}
              maxLength={maxLength}
              enterButton={ showTime }
              size="large"
              onSearch={this.handleGetCode}
              style={{ width: 300 }}
            />
          )}
        </Form.Item>
      ) : (<span key={index}></span>))
    )
  }

  // 提交
  handleSubmit = () => {
    const { validateFields } = this.props.form
    const { type } = this.state
    validateFields((errors, values) => {
      if (!errors) {
        // 通过校验
        type === 'login' && this.login(values)
        type === 'register' && this.register(values)
        type === 'forget' && this.reset(values)
      }
    })
  }

  // 登录
  login = (params) => {
    login(params).then(res => {
      setToken(res.token)
      message.success("登录成功，正在跳转")
      window.location.href="/"

    }).catch((err) => {
      console.log(err)
    })
  }

  // 注册
  register = (params) => {
    register(params).then(res => {
      message.success('注册成功')
      this.handleChange('登录', 'login')
    }).catch(() => {})
  }

  // 重置密码
  reset = (params) => {
    resetPassword(params).then(res => {
      message.success('重置密码成功')
      this.handleChange('登录', 'login')
    })
  }

  // 点击获取验证码
  handleGetCode = () => {
    this.props.form.validateFields(['phone'], (errors, values) => {
      if (!errors && !this.state.startTime) {
        this.setState({
          modal: true
        })
        this.getImgCaptcha()
      }
    })
  }

  // 获取图形验证码
  getImgCaptcha = () => {
    this.setState({
      captchaImg: `${getCaptcha}?_t=${new Date().getTime()}`
    })
  }

  // 获取手机验证码
  getSmsCode = () => {
    const { getFieldValue } = this.props.form
    const { captcha } = this.state
    const params = {
      phone: getFieldValue('phone'),
      captcha
    }

    const { type } = this.state
    let request = ''
    if (type === 'register') {
      request = sendSms
    } else if (type === 'forget') {
      request = resetSendSms
    }

    request(params).then(() => {
      message.success('手机验证码已发送')
      this.setState({ captcha: '', modal: false, startTime: Date.now() })
      setTimeout(() => { this.smsCountDown() })
    }).catch((err) => {
      console.log(err)
      this.getImgCaptcha()
    })
  }

  // 60秒倒计时
  smsCountDown = () => {
    const { startTime } = this.state 
    const contrastTime = Date.now(),
          range = 60
    const diff = range - Math.ceil((contrastTime - startTime)/1000)
    if (diff) {
      this.setState({
        showTime: `${diff}s`
      })
      timer = setTimeout(() => {
        this.smsCountDown()
      }, 1000)
    } else {
      this.setState({
        showTime: '发送验证码',
        startTime: ''
      })
      clearTimeout(timer)
    }
  }

  // 验证码输入框
  onInput = e => {
    e.persist()
    this.setState({ captcha: e.target.value })
  }

  componentWillUnmount() {
    clearTimeout(timer)
  }

  render() {
    const state = this.state
    const pageTitle=getTitle("page","登录");
    return (
      <>
        <PageHead title={pageTitle}></PageHead>
        <div className="login">
          <div className="wrapper">
            <h3 className="title">{ state.title }</h3>
            <Form>
              {
                modalMap[state.type]['content'].map((v, i) => (
                  this.FormItem(v, i)
                ))
              }
              <Form.Item className="submit">
                <Button type="primary" size="large" onClick={ this.handleSubmit }>{modalMap[state.type]['btn']}</Button>
              </Form.Item>
            </Form>
          </div>
          <div className="footer">
            {
              state.type === 'login' && (<> 
                <div>
                  <Button type="link" onClick={ () => this.handleChange('重置密码', 'forget') }>忘记了密码？ </Button>
                </div>
                <div>
                  <span>还没有注册</span>
                  <Button type="link" onClick={ () => this.handleChange('注册', 'register') }>注册 </Button>
                </div>
              </>)
            }
            {
              state.type === 'forget' && (<>
                <div>
                  <Button type="link" onClick={ () => this.handleChange('登录', 'login') }>返回登录 </Button>
                </div>
              </>)
            }
            {
              state.type === 'register' && (<>
                <div>
                  <span>已经注册过了？</span>
                  <Button type="link" onClick={ () => this.handleChange( '登录', 'login') }>登入 </Button>
                </div>
              </>)
            }
          </div>  
          <Modal title="图形验证码" visible={state.modal} onCancel={() => {this.setState({modal: false})}} closable={true} keyboard={false} maskClosable={false} footer={null} width={400} wrapClassName="captcha-modal">
            <Input
              value={state.captcha}
              size="large"
              placeholder="请输入图形验证码"
              onChange={this.onInput}
            />
            <img src={state.captchaImg} className="captcha-img" onClick={this.getImgCaptcha}/>
            <div className="get-smscode">
              <Button type="primary" size="large" onClick={ this.getSmsCode }>获取验证码</Button>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}
export default Form.create()(Login)
