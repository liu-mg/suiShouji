<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />
        <!-- el-form-item:是表单项目组件，每个表单域需要通过此组件圈选 -->
        <el-form-item prop="mobile">
          <!-- el-input:普通输入框组件 -->
          <!-- v-model：双向数据绑定 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码"></el-input>
        </el-form-item>

        <el-form-item style="text-align:left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
      // if (value) {
      //   callback()
      // } else {
      //   return callback(new Error('清无条件遵守规矩'))
      // }
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      loginForm: {
        mobile: '', // 手机号码
        code: '',
        xieyi: false
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // 账号真实性校验
        var pro = this.$http.post('/authorizations', this.loginForm)
        pro
          .then(result => {
            if (result.data.message === 'OK') {
              // 客户端记录用户的信息
              window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
              // 进入后台系统
              this.$router.push('/home')
            }
          })
          .catch(err => {
            return this.$message.error('用户名或密码错误' + err)
          })
          // this.$router.push({ name: 'home' })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-image: url("./login_bg.jpg");
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 400px;
    height: 340px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-form {
      width: 75%;
      img {
        width: 50%;
        margin: 20px auto;
      }
    }
  }
}
</style>
