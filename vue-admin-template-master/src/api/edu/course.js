import request from '@/utils/request'

const api_name = '/eduservice/edu-course'

export default {
  // 添加课程信息
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/saveCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 查询所有讲师
  getListTeacher() {
    return request({
      url: '/eduservice/edu-teacher/findAll',
      method: 'get'
    })
  },
  // 修改课程信息
  getCourseInfoId(id) {
    return request({
      url: `${api_name}/getCourseInfo/${id}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfoById(courseInfo) {
    return request({
      url: `${api_name}/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getCoursePublishInfoById(id) {
    return request({
      url: `${api_name}/course-publish-info/${id}`,
      method: 'get'
    })
  },
  publishCourse(id) {
    return request({
      url: `${api_name}/publish-course/${id}`,
      method: 'put'
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }
}
