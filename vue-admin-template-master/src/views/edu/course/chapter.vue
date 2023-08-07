<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="marginbottom:
    40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style="" type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-form label-width="120px">
        <el-form-item>
          <el-button @click="previous">上一步</el-button>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controlsposition="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controlsposition="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
import vod from '@/api/edu/vod'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 所属课程
      chapterVideoList: [],
      saveVideoBtnDisabled: false,
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      chapter: { // 封装章节信息
        title: '',
        sort: 0
      },
      video: { // 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },
  created() {
    // 获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
    }
    // 根据课程id查询章节和小节
    this.getChapterVideo()
  },
  methods: {

    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleVodRemove(file, fileList) {
      console.log(file)
      vod.removeById(this.video.videoSourceId).then(response => {
        this.$message({
          type: 'success',
          message: '删除视频成功！'
        })
        // 清空上传的文件列表，由于只限制了一个视频，可以直接清空
        this.fileList = []
        // 删除视频后还需要清空video的视频id和名称
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    },
    // 上传视频
    // 成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    // 视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // ==========================课时小节操作=========================
    // 修改小节按钮
    editVideo(videoId) {
      video.getVideoInfoById(videoId).then(response => {
        this.video = response.data.item
        this.fileList = [{ 'name': this.video.videoOriginalName }]
      })
      this.dialogVideoFormVisible = true
    },
    // saveOrUpdateVideo() {
    //   if (!this.video.id) {
    //     this.saveDataVideo()
    //   } else {
    //     this.updateDataVideo()
    //   }
    // },
    // saveDataVideo() {
    //   this.video.courseId = this.courseId
    //   this.video.chapterId = this.chapterId
    //   video.saveVideoInfo(this.video).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: '保存成功!'
    //     })
    //     this.helpSaveVideo()
    //   })
    // },
    // updateDataVideo() {
    //   video.updateVideoInfoById(this.video).then(response => {
    //     this.$message({
    //       type: 'success',
    //       message: '修改成功!'
    //     })
    //     this.helpSaveVideo()
    //   })
    // },
    // helpSaveVideo() {
    //   this.dialogVideoFormVisible = false// 如果保存成功则关闭对话框
    //   this.getChapterVideo()// 刷新列表
    //   this.video.title = ''// 重置章节标题
    //   this.video.sort = 0// 重置章节标题
    //   this.video.videoSourceId = '' // 重置视频资源id
    //   this.video.videoOriginalName = '' // 重置文件初始名
    //   this.saveVideoBtnDisabled = false
    // },
    // removeVideo(videoId) {
    //   this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     return video.removeById(videoId)
    //   }).then(() => {
    //     this.getChapterVideo()// 刷新列表
    //     this.$message({
    //       type: 'success',
    //       message: '删除成功!'
    //     })
    //   }).catch((response) => { // 失败
    //     if (response === 'cancel') {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       })
    //     }
    //   })
    // },
    // 修改小节
    updateVideo() {
      // 修改完毕保存
      video.updateVideoInfoById(this.video).then((response) => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '修改小节成功!'
        })
        this.video = {}
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 添加小节
    openVideo(chapterId) {
      this.video = {}
      this.fileList = []
      // 设置章节id
      this.video.chapterId = chapterId
      // 设置课程id
      this.video.courseId = this.courseId

      this.dialogVideoFormVisible = true
    },
    saveOrUpdateVideo() {
      this.saveBtnDisabled = false
      // 根据有无videoId判断是添加还是修改小节
      if (this.video.id) {
        this.updateVideo()
      } else {
        this.addVideo()
      }
    },
    addVideo() {
      video.saveVideoInfo(this.video).then((response) => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 提示信息
        this.$message({
          type: 'success',
          message: '添加小节成功!'
        })
        // 清空表单数据
        this.video = {}
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 删除小节
    removeVideo(id) {
      console.log(id)
      this.$confirm('此操作将删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，执行then方法
        // 调用删除的方法
        video.removeById(id).then((response) => {
          // 删除成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除小节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
      })
    },
    // =============================章节操作======================
    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.removeByChapter(chapterId)
      }).then(() => {
        this.getChapterVideo()// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },
    // 添加章节
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.chapter.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存数据
    saveData() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.helpSave()
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    // 章节数据
    updateData() {
      chapter.updateByChapter(this.chapter).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.helpSave()
      }).catch((response) => {
        // console.log(response)
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    helpSave() {
      this.dialogChapterFormVisible = false// 如果保存成功则关闭对话框
      this.getChapterVideo()// 刷新列表
      this.chapter.title = ''// 重置章节标题
      this.chapter.sort = 0// 重置章节标题
      this.saveBtnDisabled = false
      this.fileList = []
    },
    // 编辑功能
    editChapter(chapterId) {
      chapter.getByChapter(chapterId).then(response => {
        this.chapter = response.data.items
      })
      this.dialogChapterFormVisible = true
    },
    // 章节弹框方法
    openChapterDialog() {
      this.chapter.title = ''
      this.chapter.sort = 0
      // 添加章节点击时清空chapter的id
      this.chapter.id = ''
      this.dialogChapterFormVisible = true
    },
    // 根据课程id获取id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.items
        })
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  /*float: left;*/
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  /*float: left;*/
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
