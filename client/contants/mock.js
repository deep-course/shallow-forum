const userSelectMap = [
  {
    key: 'write',
    value: '我的资料',
    icon: 'edit'
  },
  {
    key: 'self',
    value: '个人设置',
    icon: 'user'
  },
  {
    key: 'logout',
    value: '登出',
    icon: 'login'
  },
]

const tabList = [
  {
    color: '',
    name: '所有话题',
    type: ''
  },
  {
    color: 'rgb(254, 181, 77)',
    name: '求助',
    type: 1
  },
  {
    color: 'rgb(103, 204, 234)',
    name: '开发',
    type: 2
  },
  {
    color: 'rgb(146, 230, 217)',
    name: 'UX',
    type: 3
  },
  {
    color: 'rgb(154, 206, 199)',
    name: '插件拓展',
    type: 4
  },
  {
    color: 'rgb(198, 176, 227)',
    name: '翻译',
    type: 5
  },
  {
    color: 'rgb(153, 160, 200)',
    name: 'FAQ',
    type: 6
  },
  {
    color: 'rgb(226, 199, 131)',
    name: '需求',
    type: 7
  },
  {
    color: 'rgb(208, 150, 150)',
    name: '公告',
    type: 8
  },
  {
    color: 'rgb(255, 85, 204)',
    name: '反馈Bug',
    type: 9
  },
]

const indexList = [
  {
    avatar: 'http://discuss.flarum.org.cn/assets/avatars/dstui4jgcrupi6ye.jpg',
    name: 'kankisen',
    title: '不可以',
    date: '发布于2019/07/22',
    type: 2,
    comment: 20,
    star: 21,
  },
  {
    avatar: 'http://discuss.flarum.org.cn/assets/avatars/dstui4jgcrupi6ye.jpg',
    name: 'kankisen',
    title: '不可以',
    date: '发布于2019/07/22',
    type: 7,
    comment: 20,
    star: 21,
  },
  {
    avatar: 'http://discuss.flarum.org.cn/assets/avatars/dstui4jgcrupi6ye.jpg',
    name: 'kankisen',
    title: '不可以',
    date: '发布于2019/07/22',
    type: 4,
    comment: 20,
    star: 21,
  }
]

export {
  userSelectMap,
  tabList,
  indexList,
}