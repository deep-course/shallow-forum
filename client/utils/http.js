import axios from 'axios'
import qs from 'qs'
import {message} from 'antd'
const isServer=typeof window === "undefined"
const log=isServer?console.log:message.error
const instance = axios.create({
    baseURL: '',
    timeout: 20000,
    // withCredentials: true,
});
// 请求参数处理
instance.interceptors.request.use(config => {
    if (config.method === 'post') {
        config.data = qs.stringify(config.data)
    }
    return config;
}, err => {
    log('请求超时！');
    return Promise.reject(err);
})

// 请求结果处理
instance.interceptors.response.use(res => {
    if (!(res.status === 200 && res.data.err === 0)) {
        log(res.data.msg)
        return Promise.reject();
    }
    return Promise.resolve(res.data.data);
}, err => {
    log('服务异常')
    return Promise.reject(err);
})


export default {
    get(url, params, headers) {
        if (params !== undefined) {
            Object.assign(params, {_t: new Date().getTime()});
        } else {
            // eslint-disable-next-line no-param-reassign
            params = {_t: new Date().getTime()};
        }
        return instance({method: 'get', url, params, headers});
    },

    // 不常更新的数据用这个
    getData(url, params, headers) {
        return instance({method: 'get', url, params, headers});
    },

    post(url, data, headers) {
        return instance({method: 'post', url, data, headers});
    },
};