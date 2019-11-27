import React, { Component } from 'react'
import Head from 'next/head'

class PageHead extends Component {
  render() {
    return (
      <Head>
        <title>{this.props.title}</title>
      </Head>
    )
  } 
}

export default PageHead