import request from '@/utils/request'
export default {
  getList() {
    return request({
      url: `/eduservice/Search/index`,
      method: 'get'
    })
  }
}
