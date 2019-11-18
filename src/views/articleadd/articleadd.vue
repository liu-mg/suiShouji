<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <div class="text item">
      <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quillEditor v-model="addForm.content"></quillEditor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>

          <!-- 上传图片的html结构 -->
          <ul>
            <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog(item)">
              <span>点击图标选择图片</span>
              <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
              <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <!-- 应用频道独立组件 -->
          <channel-com @slt="selectHandler"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addarticle(false)">发布</el-button>
          <el-button @click="addarticle(true)">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 对话框 -->
    <el-dialog title="素材图片" :visible.sync="dialogVisible" width="60%" @close="clearImage">
      <!-- 用于展示素材图片的标签 -->
      <ul>
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt="没有图片" @click="clkImage" />
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
// 引入注册频道
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleAdd',
  // 注册组件
  components: {
    quillEditor,
    // 注册频道独立组件
    ChannelCom
  },
  data () {
    return {
      materialUrl: '', // 选中的素材图片的路径名地址信息
      xv: 0, // 记录被单击选择框的序号信息 0 1th, 1 2th, 2 3th
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false,
        page: 1,
        per_page: 6
      },
      // 是否开启对话框
      dialogVisible: false,
      addForm: {
        title: '',
        content: '',
        cover: {
          type: 0, // 封面类型 整型的0
          images: []
        },
        channel_id: ''
      },
      // 表单验证规则
      addFormRules: {
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
    this.getImageList() // 获得供选取的素材图片
  },
  computed: {
    // 设计当前图片选择框个数
    covernum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  methods: {
    // 发布、存入草稿方法
    addarticle (flag) {
      // 表单验证
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章发布成功')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('发布文章失败' + err)
            })
        }
      })
    },
    // 设置频道methods事件方法
    // val：子组件给传递过来的频道信息
    selectHandler (val) {
      this.addForm.channel_id = val
    },
    // 展开对话框逻辑
    showDialog (n) { // 代表第n个选择框被单击到了
    // 更新xv成员
      this.xv = n - 1
      this.dialogVisible = true // 打开对话框
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
          return this.$message.error('获取素材图片列表错误' + err)
        })
    },
    // 给被选中的图片加边框
    clkImage (evt) {
      // 清除之前选择图片的状态信息
      this.clearImage()
      // 给其他项目做清除边框的操作
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      evt.target.parentNode.style.border = '4px solid red'
      // 记录选中的图片
      // 把当前选中图片的src地址信息赋予给materialUrl成员
      this.materialUrl = evt.target.src
    },
    // 选好图后点击缺点按钮，图片在发表文章图片框中显示
    imageOK () {
      if (this.materialUrl) {
        // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.addForm.cover.images[this.xv] = this.materialUrl
        // 关闭对话框
        this.dialogVisible = false
      } else {
        this.$message.error('咋地，没有你喜欢的啊')
      }
    },
    // 清除之前选择素材图片的痕迹(边框高亮，图片路径名称)
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        // 清除边框
        lis[i].style.border = ''
      }
      // 清除图片路径
      this.materialUrl = ''
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
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
