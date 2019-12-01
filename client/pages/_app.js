import React from 'react';
import App from 'next/app';
import store from '../store'
import { Provider } from 'mobx-react'
import Layout from '../components/Layout'
import 'antd/dist/antd.css'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Provider {...store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>  
      </Provider>
    )
  }
}

export default MyApp
