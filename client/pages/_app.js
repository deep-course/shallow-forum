import React from 'react';
import App, { Container } from 'next/app';
import Layout from '../components/Layout/Layout'
// import { Provider } from 'react-redux';
// import withRedux from 'next-redux-wrapper';

// import { initializeStore, setRangeTime, getPlatformList } from '../store';
import '../assets/global.less'

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
      <Container>
        <Layout>
          {/* <Component {...pageProps} router={router} /> */}
          <Component {...pageProps} />
        </Layout>
          
      </Container>
    )
  }
}

export default MyApp
