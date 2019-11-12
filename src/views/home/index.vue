<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <el-menu
        router
        background-color="#323745"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/welcome" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="2-1">发表文章</el-menu-item>
          <el-menu-item index="/article">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>

        <el-menu-item index="3" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>

        <el-menu-item index="4" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="lt">
          <i
            slot="prefix"
            :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
            style="cursor:pointer;"
            @click="isCollapse=!isCollapse">
          </i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>

        <div class="rt">
          <el-input placeholder="请输入要搜索的文章内容" v-model="input" style="width:240px">
            <span slot="prefix" class="iconfont icon-fangdajing" style="line-height:40px;"></span>
          </el-input>
          <span style="margin:0 15px">消息</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="photo" alt width="40" height="40" style="border-radius:50%;margin-right:5px;"/>
              {{ name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus">个人信息</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus">github地址</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus-outline" @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <!-- 子级页面显示占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      isCollapse: false,
      input: ''
    }
  },
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    // 退出系统
    logout () {
      this.$confirm('确定要退出系统吗', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    padding: 0 9px 0 10px;
    min-width: 850px;
    .lt {
      width: 40%;
      height: 100%;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    .rt {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
  .el-main {
    background-color: #f2f3f5;
  }
}
</style>
