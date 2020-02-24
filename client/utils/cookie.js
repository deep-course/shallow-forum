import {parseCookies, setCookie, destroyCookie} from 'nookies'

/**
 * 获取cookies中的token
 * 默认不传参数为览器端
 * SSR需要传递cookies参数
 * @param cookies
 * @returns {{}|{token: *}}
 */
function getToken(cookies = {}) {
    let cookie = {};
    if (cookies && Object.keys(cookies).length == 0) {
        //客户端获取cookies
        cookie = parseCookies({})
    } else {
        cookie = cookies;
    }

    if (cookie && cookie["token"]) {
        return {token: cookie["token"]};
    } else {
        return {};
    }
}

/**
 * 设置cookies没有SSR调用，纯浏览器端调用
 * @param token
 */
function setToken(token) {
    setCookie({}, 'token', token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    })
}

/**
 * 清除cookies只浏览器端调用
 */
function clearToken() {
    destroyCookie(null, 'token')
}

module.exports = {
    getToken,
    setToken,
    clearToken
}