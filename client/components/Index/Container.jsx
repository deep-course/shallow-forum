import { Select, Icon, Skeleton, Button } from 'antd'
import './container.less'
import { tabList, indexList } from '../../contants/mock'
import TabItem from './TabItem'
import ListItem from './ListItem'

const { Option } = Select

export default () => (
  <div className="index-container">
    <div className="tab">
      <h6 className="write">新的话题</h6>
      <ul>
        {
          tabList.length && tabList.map((v, i) => (
            <TabItem key={i} data={v}></TabItem>
          ))
        }
      </ul>
    </div>
    <div className="list">
      <div className="opera">
        <Select className="select" defaultValue="new" style={{ width: 120 }}>
          <Option value="new">最新</Option>
          <Option value="hot">热门</Option>
        </Select>
        <Icon type="sync" className="refresh"/>
      </div>
      {
        indexList.length && indexList.map((v, i) => (
          <ListItem key={i} data={v}></ListItem>
        ))
      }
      <Skeleton loading={true} active></Skeleton>
      <div className="load-more">
        <Button type="primary">加载更多</Button>
        {/* <Button disabled={true}>已加载全部</Button> */}
      </div>
    </div>
  </div>
)