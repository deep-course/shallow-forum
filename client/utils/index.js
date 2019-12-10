// 获取localStorage token
export function getToken () {
  try {
    return {
      token: localStorage['token'] || '' 
    }
  } catch (e) {
    return {
      token: ''
    }
  }
}