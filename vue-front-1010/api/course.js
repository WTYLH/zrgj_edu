import request from '@/utils/request'
export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `/eduservice/edu-course/front/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
// 需要获取课程二级分类

  getAllSubject() {
    return request({
      url: `/eduservice/edu-subject/getAllSubject`,
      method: 'get'
    })
  },
  getById(courseId) {
    return request({
      url: `/eduservice/edu-course/getFrontCourseInfo/${courseId}`,
      method: 'get'
    })
  }
}
