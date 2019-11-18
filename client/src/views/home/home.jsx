import React from 'react'
import Layout from '@component/layout'
import { Button } from 'antd' 
class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Button type="primary">首页</Button>
      </Layout>
    );
  }
}
export default Home