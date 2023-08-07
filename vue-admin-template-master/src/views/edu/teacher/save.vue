<template>
  <div class="app-container">
    讲师表单
    <template>
      <div class="app-container">
        <el-form label-width="120px">
          <el-form-item label="讲师名称">
            <el-input v-model="teacher.name"/>
          </el-form-item>
          <el-form-item label="讲师排序">
            <el-input-number
              v-model="teacher.sort"
              :min="0"
              controls-position="right"/>
          </el-form-item>
          <el-form-item label="讲师头衔">
            <el-select v-model="teacher.level" clearable placeholder="请选择">
              <!--数据类型一定要和取出的json中的一致，否则没法回填因此，
                这里value使用动态绑定的值，保证其数据类型是number-->
              <el-option :value="1" label="高级讲师"/>
              <el-option :value="2" label="首席讲师"/>
            </el-select>
          </el-form-item>
          <el-form-item label="讲师资历">
            <el-input v-model="teacher.career"/>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
          </el-form-item>

          <!-- 讲师头像：TODO -->

          <!-- 讲师头像 -->
          <el-form-item label="讲师头像">
            <!-- 头衔缩略图 -->
            <pan-thumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 -->
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="imagecropperShow=true">更换头像
            </el-button>
            <!--v-show：是否显示上传组件:key：类似于id，如果一个页面多个图片上传控件，
              可以做区分:url：后台上传的url地址@close：关闭上传组件@crop-upload-success：上传成功后的回调 -->
            <image-cropper
              v-show="imagecropperShow"
              :width="300"
              :height="300"
              :key="imagecropperKey"
              :url="BASE_API+'/eduoss/fileoss'"
              field="file"
              @close="close"
              @crop-upload-success="cropSuccess"/>
          </el-form-item>

          <el-form-item>
            <el-button
              :disabled="saveBtnDisabled"
              type="primary"
              @click="saveOrUpdate">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      imagecropperShow: false, // 上传弹框组件是否显示
      imagecropperKey: 0, // 上传组件key值
      BASE_API: process.env.BASE_API, // 获取dev.env.js里面的地址,为什么？
      saveBtnDisabled: false // 保存按钮是否禁用,
    }
  },

  watch: { // 监听
    $route(to, from) { // 路由变化方式，路由发生变化，方法就会发生变化
      console.log('watch $route')
      this.init() // 路由一变项目就会响应
    }
  },

  created() { // 首次写表格
    console.log('created')
    this.init()
  },

  methods: {
    close() { // 组件的关闭
      this.imagecropperShow = false
      // 上传之后接口返回图片地址
      this.imagecropperKey = this.imagecropperKey + 1
    },

    cropSuccess(data) { // 组件的保存
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },

    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else { // 路径没有id值，做添加
      // 清空表单
        this.teacher = {} // 并没有解决问题 ，第一次跳转时，执行created（）方法，后面不会执行该方法
      }
    },

    // 总调用保存或者更新
    // 根据里面有id就修改，没有就添加
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // 新增用户，保存用户信息
    saveData() {
      teacher.save(this.teacher).then(response => {
        return this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).then(resposne => {
        this.$router.push({ path: '/teacher/table' })
        // 这里开头不是http一定要记住需要'/'
      }).catch(response => {
        // console.log(response)
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    },

    // 根据id查询记录
    fetchDataById(id) {
      teacher.getById(id).then(response => {
        this.teacher = response.data.teacher
        // 一定要注意这个采用的items是返回数据类型，是一个字符串，代表着这个讲师对象
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },

    // 根据id更新记录
    updateData() {
      this.saveBtnDisabled = true
      teacher.updateById(this.teacher).then(response => {
        return this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).then(resposne => {
        this.$router.push({ path: '/teacher/table' })
      }).catch((response) => {
        // console.log(response)
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    }
  }
}
</script>
