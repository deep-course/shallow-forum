import React from 'react'
import {observer, inject} from 'mobx-react';
import PageHead from '../components/PageHead'
import ListItem from '../components/ListItem'
import '../assets/pageStyle/search.less'

//@inject('global', 'search')
@observer
class Home extends React.Component{
  static async getInitialProps ({ ctx }) {
    return { };
  }
  render() {
    const { list, loading } = this.props.search
    return (
      <>
        <PageHead title="论坛-搜索"></PageHead>
        <div className="index-list">
          {list.map((data, index) => (
            <ListItem data={data} key={index}></ListItem>
          ))}
        </div>
      </>
    )
  }
}

export default Home
