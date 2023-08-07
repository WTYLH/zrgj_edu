import request from '@/utils/request'
const api_name = '/eduservice/edu-chapter'
export default {
  getAllChapterVideo(courseId) {
    return request({
      url: `${api_name}/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: `${api_name}/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  getByChapter(chapterId) {
    return request({
      url: `${api_name}/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },
  removeByChapter(chapterId) {
    return request({
      url: `${api_name}/deleteChapter/${chapterId}`,
      method: 'delete'
    })
  },
  updateByChapter(chapter) {
    return request({
      url: `${api_name}/updateChapter`,
      method: 'post',
      data: chapter
    })
  }
}
