<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <div class="text item cardbody">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          :rules="accountFormRules"
          label-width="100px"
        >
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="httpRequest"
        >
          <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" width="200" height="200" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
// 导入bus.js组件
import bus from '@/utils/bus.js'
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        name: '',
        mobile: '13911111111',
        email: '',
        intro: ''
      },
      // 表单验证
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          {
            min: 3,
            max: 30,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    // 给更新账户按钮添加方法
    editAccount () {
      // 表单验证
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                // 账户名字更新
                bus.$emit('upAccountName', result.data.data.name)
                // 提示修改成功
                this.$message.success('修改账号信息成功')
              }
            })
            .catch(err => {
              return this.$message.error('更新账户失败：' + err)
            })
        }
      })
    },
    // 获得账户基本信息
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把获得的账户信息赋予给accountForm
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获得账户信息失败' + err)
        })
    },
    // 自定义上传头像行为
    // resource参数：是一个对象，里边有当前正在上传的图片信息，(resource.file)
    httpRequest (resource) {
      // FormData表单数据对象收集表单信息，即上传附件信息
      let fd = new FormData()
      // 把图片的信息添加给fd对象  fd.append(名称，值)
      fd.append('photo', resource.file) // 文件保存至fd
      // axios将附件传到服务器端存储
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm.photo = result.data.data.photo
            bus.$emit('upAccountPhoto', result.data.data.photo)
            this.$message.success('头像更新成功')
          }
        })
        .catch(err => {
          return this.$message.error('上传用户头像失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 40%;
  }
  .rt {
    width: 30%;
  }
}
</style>
