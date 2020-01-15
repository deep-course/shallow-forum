import global from './global'
import search from './search'
import detail from './detail'
import user from './user'
import write from './write'
import BoardSetting from './boardsetting'
import CurrentUser from "./currentuser";
import { useStaticRendering } from 'mobx-react';
const isServer = typeof window === 'undefined';

let store = null;

useStaticRendering(isServer);
export default function initializeStore(initData={}) {
  if (isServer) {
    return {
      boardSetting: new BoardSetting(initData.boardSetting),
      global,
      user,
      currentUser:new CurrentUser(initData.currentUser),
    };
  }
  if (store === null) {
    store = {
      boardSetting: new BoardSetting(initData.boardSetting),
      global,
      user,
      currentUser:new CurrentUser(initData.currentUser),
    };
  }

  return store;
}