import vue from 'vue'
import { Message } from 'element-ui'

const defaultErr = '接口发生错误'

/**
 *
 * @param url
 * @param options {showErr: true }  默认显示错误
 * @returns {Promise}
 */

export function httpGet(url, options) {
    options = {
        params: {},
        showErr: true,
        ...options
    }

    const { showErr } = options
    delete options.showErr

    return new Promise((resolve, reject) => {
        vue.http.get(url, options).then(({ body }) => {
            const { code, message, data } = body
            if (code === 0) {
                resolve(data)
            } else {
                showErr && Message.error(message || defaultErr)
                reject(body)
            }
        }, err => {
            showErr && Message.error((err.body && err.body.message) || defaultErr)
            reject(defaultErr)
        })
    })
}

export function httpPost(url, params, options) {
    options = {
        showErr: true,
        ...options
    }
    const { showErr } = options
    delete options.showErr

    return new Promise((resolve, reject) => {
        vue.http.post(url, params, options).then(({ body }) => {
            const { code, message, data } = body
            if (code === 0) {
                resolve(body)
            } else {
                showErr && Message.error(message || defaultErr)
                reject(body)
            }
        }, err => {
            showErr && Message.error((err.body && err.body.message) || defaultErr)
            reject(defaultErr)
        })
    })
}

// export http
export default vue.http