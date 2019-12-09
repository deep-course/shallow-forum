import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import store from '../store'
import { Provider } from 'mobx-react'

import Layout from '../components/Layout'

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
