import request from '@/utils/request'
const api_name = '/eduservice/edu-teacher'

export default {
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/pageTeacherCondition/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  removeById(teacherId) {
    return request({
      url: `${api_name}/${teacherId}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: `${api_name}/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/getTeacher/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
      url: `${api_name}/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }
}

