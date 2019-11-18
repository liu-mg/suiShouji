<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改文章</span>
    </div>
    <div class="text item">
      <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quillEditor v-model="editForm.content"></quillEditor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="editForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>

          <!-- 图片展示的HTML结构 -->
          <ul>
            <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog(item)">
              <span>点击图标选择图片</span>
              <img v-if="editForm.cover.images[item-1]" :src="editForm.cover.images[item-1]" alt />
              <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <channel-com @slt="selectHandler" :cid="editForm.channel_id"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">发布</el-button>
          <el-button @click="editarticle(true)">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="素材图片" :visible.sync="dialogVisible" width="60%" @close="clearImage">
      <!-- 用于展示素材图片的标签 -->
      <ul>
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt="图片走丢了~" @click="clkImage" />
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入富文本编辑器相关css文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入富文本编辑器组件模块(es6模块化-按需导入)
import { quillEditor } from 'vue-quill-editor'
// 引入频道公共组件
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleEdit',
  // 注册组件
  components: {
    quillEditor,
    ChannelCom
  },
  // 计算属性
  computed: {
    // 被修改文章的id
    aid () {
      // 之前获得文章id参数：this.$route.params.aid, 计算封装之后：this.aid
      return this.$route.params.aid
    },
    // 设计当前图片选择框个数
    covernum () {
      if (this.editForm.cover.type > 0) {
        return this.editForm.cover.type
      }
      return 0
    }
  },
  data () {
    return {
      materialUrl: '', // 选中的素材图片的路径名地址信息
      xv: 0,
      imageList: '', // 用于接收图片列表信息
      dialogVisible: false, // 默认不开启对话框
      channel_id: '',
      editForm: {
        title: '',
        content: '',
        cover: {
          type: 0, // 封面类型 整型的0
          images: []
        }
      },
      querycdt: {
        // 设定获取图片列表的条件
        collect: false,
        page: 1,
        per_page: 6
      },
      // 表单验证规则
      editFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 标题长度在5到30个字符之间
          {
            min: 5,
            max: 30,
            message: '标题介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容不能为空' }],
        channel_id: [{ required: true, message: '频道必填' }]
      }
    }
  },
  created () {
    this.getArticleByAid()
    this.getImageList()
  },
  methods: {
    // 根据id获取文章信息展示修改页面
    getArticleByAid () {
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把文章赋予给editForm里边
            this.editForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取文章失败' + err)
        })
    },
    // 文章编辑的方法
    editarticle (flag) {
      // 表单验证
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章修改成功')
              // 恢复表单的标志为false，没有修改
              this.editFormDirty = false
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('修改文章失败' + err)
            })
        }
      })
    },
    // 设置频道事件方法
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    // 控制对话框是否显示
    showDialog (n) {
      this.xv = n - 1
      this.dialogVisible = true
    },
    // 获取素材图片列表
    getImageList () {
      let pro = this.$http.get('user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获取文章列表错误' + err)
        })
    },
    // 素材被选中，设置高亮标志
    clkImage (evt) {
      // 调用清除素材痕迹的方法
      this.clearImage()
      // 其他项目清除边框
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      evt.target.parentNode.style.border = '4px solid red'
      this.materialUrl = evt.target.src
    },
    imageOK () {
      // 选好素材后点击对话框确定按钮记录素材图片
      if (this.materialUrl) {
        // 增加素材图片请求地址信息
        this.editForm.cover.images[this.xv] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('咋地，没有你喜欢的啊')
      }
    },
    // 清除之前选择素材图片的痕迹
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      this.materialUrl = '' // 清除图片路径名
    }
  }
}
</script>

<style lang="less" scoped>
/*给富文本编辑器的编辑区域设置高度*/
.el-form /deep/ .ql-editor {
  height: 200px;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}

// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid rgb(71, 54, 54);
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
