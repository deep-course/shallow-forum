import React from 'react';
import App from 'next/app';
import store from '../store'
import { Provider } from 'mobx-react'
import Router from 'next/router';
import Layout from '../components/Layout'

import {getBoardSet} from '../api'

Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV !== 'production') {
    const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
    const timestamp = new Date().valueOf();
    els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
    els[0].setAttribute('rel', 'stylesheet')
  }
});

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {};
    //初始化论坛信息
    const setting=await getBoardSet()
    //这里还能初始化用户信息，并且判断用户类型
    pageProps=Object.assign(pageProps,setting);
    if (Component.getInitialProps) {
      const compprops=await Component.getInitialProps({ ctx });
      pageProps = Object.assign(pageProps,compprops);
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
