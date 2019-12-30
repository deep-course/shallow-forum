//import cookie from 'cookie';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
function getToken(cookies) {
  let cookie = {};
  if (cookies && Object.keys(cookies).length == 0) {
    //客户端获取cookies
    cookie = parseCookies({})
  } else {
    cookie = cookies;
  }

  if (cookie && cookie["token"]) {
    return { token: cookie["token"] };
  } else {
    return {};
  }




}

function setToken(token) {
  //let cookies = cookie.serialize('token', String(token), {
  //  maxAge: 86400
  //});
  //document.cookie = cookies;
}

module.exports = {
  getToken,
  setToken
}