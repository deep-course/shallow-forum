import React, { Component } from 'react'
class TagList extends Component {
  static defaultProps={
    taglist:[],
    maintag:"",
    subtag:"",
}
  constructor(props) {
    super(props)

  }
  //获取筛选器
  getNewTagList = () => {
    let taglistMap = new Map();
    let mainTagList = [];
    this.props.taglist.forEach(item => {
      if (item.type == 'main') {
        taglistMap.set(item.slug, [])
        mainTagList.push(item);
      }
    });
    this.props.taglist.forEach(item => {
      if (item.type == 'sub') {
        let subList = taglistMap.get(item.tagpath) || [];
        subList.push(item)
      }
    })
    //console.log(taglistMap);
    return {
      taglistMap,
      mainTagList
    }
  }
  render() {
    let { maintag, subtag } = this.props;
    const { taglistMap, mainTagList } = this.getNewTagList();
    let subTagList = [];
    if (maintag && taglistMap.get(maintag)) {
      subTagList = taglistMap.get(maintag);
    }
    return (

      <div>
        <ul className="index-filter-tab">
          {mainTagList.map((data, index) => (
            <li
              className={`index-filter-tab-item ${maintag == data.slug ? 'current' : ''}`}
              key={data.slug}
            ><a href={"/t/" + data.slug}>{data.name}</a></li>
          ))}
          <br />
          {maintag && subTagList.length > 0 &&

            subTagList.map(tag => (
              <li
                className={`index-filter-tab-item ${subtag == tag.slug ? 'current' : ''}`}
                key={tag.slug}
              ><a href={"/t/"+maintag+"/" + tag.slug}>{tag.name}</a></li>
            ))


          }
        </ul>
      </div>

    )
  }
}

export default TagList