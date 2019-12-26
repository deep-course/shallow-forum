import cookie from 'cookie';

function getToken(){
  let cookies = cookie.parse(document.cookie);
  let token = cookies['token'] || '';
  return { token };
}

function setToken(token){
  let cookies = cookie.serialize('token', String(token), {
    maxAge: 86400 
  });
  document.cookie = cookies;
}

module.exports = {
  getToken,
  setToken
}