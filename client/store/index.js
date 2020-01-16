import BoardSetting from './boardsetting'
import UserSetting from "./usersetting";
import CurrentUser from "./currentuser";
import { useStaticRendering } from 'mobx-react';
const isServer = typeof window === 'undefined';

let store = null;
//需要再ssr返回对象类型
//只浏览器端的返回实例
useStaticRendering(isServer);
export default function initializeStore(initData={}) {
  if (isServer) {
    return {
      boardSetting: new BoardSetting(initData.boardSetting),
      userSetting:UserSetting,
      currentUser:new CurrentUser(initData.currentUser),
    };
  }
  if (store === null) {
    store = {
      boardSetting: new BoardSetting(initData.boardSetting),
      userSetting:UserSetting,
      currentUser:new CurrentUser(initData.currentUser),
    };
  }

  return store;
}