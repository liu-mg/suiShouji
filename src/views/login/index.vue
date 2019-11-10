<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />
        <!-- el-form-item:是表单项目组件，每个表单域需要通过此组件圈选 -->
        <el-form-item prop="mobile">
          <!-- el-input:普通输入框组件 -->
          <!-- v-model：双向数据绑定 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号">
            <span slot="prefix" class="iconfont icon-shouji"></span>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码">
            <span slot="prefix" class="iconfont icon-verify-fill"></span>
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="isActive"
            :disabled="isActive"
            type="primary"
            style="width:100%"
            @click="login()"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入极验的gt.js文件
import '@/assets/js/gt.js'
// 引入iconfont的css文件
import '@/assets/iconfont/iconfont.css'
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
      isActive: false,
      ctaObj: null, // 极验对象
      loginForm: {
        mobile: '13622223333', // 手机号码
        code: '246810',
        xieyi: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [{ validator: xieyiTest }]
      }
    }
  },

  // 生命周期
  // 按回车键进行登录
  created () {
    let that = this
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        that.login()
        return false
      }
    }
  },

  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        // 表单域校验成功
        if (valid) {
          if (this.ctaObj !== null) {
            return this.ctaObj.verify()
          }
          // 登录按钮处于等待、禁用状态
          this.isActive = true
          // A. 获得极验请求秘钥信息
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              // 接收处理返回的极验请求秘钥信息
              let { data } = result.data
              // 显示极验应用窗口
              window.initGeetest(
                {
                  // 以下配置参数来自服务端
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind' // 没有按钮，通过登录按钮激活验证
                },
                captchaObi => {
                  captchaObi
                    .onReady(() => {
                      // 验证码ready之后才能调用verify方法显示验证码
                      captchaObi.verify() // 显示验证码窗口
                      this.isActive = false // 恢复按钮
                      this.ctaObj = captchaObi // 已将极验对象赋予给ctaObj
                    })
                    .onSuccess(() => {
                      // B. 账号真实存在，登录后台
                      this.loginAct()
                    })
                    .onError(() => {})
                }
              )
              // 服务端返回极验的请求秘钥信息
              console.log(result)
            })
            .catch(err => {
              return this.$message.error('获得极验初识校验信息错误' + err)
            })
          // B. 账号真实存在，登录后台
          // this.loginAct()
        }
      })
    },
    loginAct () {
      // 账号真实性校验
      var pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 客户端记录用户的信息
            window.sessionStorage.setItem(
              'userinfo',
              JSON.stringify(result.data.data)
            )
            // 进入后台系统
            this.$router.push('/home')
          }
        })
        .catch(err => {
          return this.$message.error('用户名或密码错误' + err)
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
