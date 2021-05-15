import axios from 'axios'
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
export function request(config) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1'
    })
    instance.interceptors.request.use(
      config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
      },
      err => {
        console.log(err)
      }
    )
    instance.interceptors.response.use(
      res => {
        return res.data
      },
      err => {
        console.log(err)
      }
    )
    instance(config)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
