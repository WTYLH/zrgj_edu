<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="marginbottom:
    40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->

      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" width="200px">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  title: '',
  subjectId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '/static/1.jpg',
  price: 0
}
export default {
  // 声明组件
  components: { Tinymce },
  data() {
    return {
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      teacherList: [], // 封装所有的讲师
      subjectOneList: [], // 一级分类
      subjectTwoList: [], // 二级分类
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 调用根据id查询课程的方法
        this.getInfo(this.courseId)
      } else {
        this.courseInfo = defaultForm
        // 初始化一级分类
        this.getOneSubject()
        // 初始化所有讲师
        this.getListTeacher()
      }
    },
    // // 根据课程id查询
    // getInfo() {
    //   course.getCourseInfoId(this.courseId)
    //     .then(response => {
    //       this.courseInfo = response.data.courseInfoVo
    //       // 查询出所有的分类（一级和二级）
    //       subject.getOneSubject()
    //         .then(response => {
    //           this.subjectOneList = response.data.items
    //
    //           for (var i = 0; i < this.subjectOneList.length; i++) {
    //             var oneSubject = this.subjectOneList[i]
    //             if (this.courseInfo.subjectParentId === oneSubject.id) {
    //               this.subjectTwoList = oneSubject.children
    //             }
    //           }
    //         })
    //       this.getListTeacher()
    //     })
    // },
    getInfo(id) {
      course.getCourseInfoId(id).then(responseCourse => {
        this.courseInfo = responseCourse.data.courseInfoVo
        // 初始化分类列表
        subject.getSubjectList().then(responseSubject => {
          this.subjectOneList = responseSubject.data.items
          for (let i = 0; i < this.subjectOneList.length; i++) {
            if (this.subjectOneList[i].id === this.courseInfo.subjectParentId) {
              this.subjectTwoList = this.subjectOneList[i].children
            }
          }
        })
        // 获取讲师列表
        this.getListTeacher()
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    // 上传成功调用方法
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },
    // 上传之前的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 查询所有的一级分类
    getOneSubject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.items
        })
    },
    // 一级分类改变，显示对应二级分类
    subjectLevelOneChanged(value) {
      // value是一级分类的id值
      // 遍历所有的分类，包含一级和二级分类
      for (var i = 0; i < this.subjectOneList.length; i++) {
        // 每一个一级分类
        var oneSubject = this.subjectOneList[i]
        // 判断：所有一级分类id和点击一级分类id是否一样
        if (value === oneSubject.id) {
          // 从一级分类里面获取二级分类
          this.subjectTwoList = oneSubject.children
          // 把二级分类的东西清空掉
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 查询所有的讲师
    getListTeacher() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },

    // 保存还是更新目录
    next() {
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存
    saveData() {
      course.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/course/chapter/' + response.data.courseID })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    updateData() {
      this.saveBtnDisabled = true
      course.updateCourseInfoById(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/course/chapter/' + this.courseId })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    }
  }
}

</script>
<style scoped>
/* scoped指在当前页面内有效 */
.tinymce-container {
line-height: 29px;
}
</style>
