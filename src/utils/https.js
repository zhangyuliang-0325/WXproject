import axios from 'axios'
import axiosAdapterUniapp from 'axios-adapter-uniapp'

const $https = axios.create({
  baseURL: 'https://api-hmugo-web.itheima.net/api/public/v1',
  adapter: axiosAdapterUniapp,
})
//请求计数器
let httpsCount = 0

// request拦截器
$https.interceptors.request.use(
  function(config) {
    //用计数器记录请求个数
    httpsCount++
    //请求前添加loading提示
    uni.showLoading({
      title: '加载中',
    })
    //在发送请求前做什么
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// respone拦截器
$https.interceptors.response.use(
  function(response) {
    //响应后隐藏loading提示
    // uni.hideLoading()
    //完成一个请求，计数器就减少1
    httpsCount--
    if (httpsCount == 0) {
      uni.hideLoading()
    }
    // return response
    //结构出数据
    const { meta, message } = response.data
    //判断数据是否成功
    if (meta && meta.status === 200) {
      //返回数据核心
      return message
    } else {
      //不能处理的格式直接返回response
      return response
    }
  },
  function(error) {
    return Promise.reject(error)
  }
)

export default $https
