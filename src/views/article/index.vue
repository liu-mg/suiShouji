<template>
  <div>
    <!-- 搜索卡片区域 -->
    <el-card class="box-card">
      <!-- 命名插槽，头部内容 -->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- 匿名插槽，内容主体 -->
      <div class="text item">
        <!-- el-form搜索表单区域 -->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio-group v-model="searchForm.status">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：">
            <!-- 引入频道独立组件 -->
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 通过el-table 和  el-table-column组件把文章的 标题、状态、时间3个列给展示出来 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ total }}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="articleList" style="width: 100%">
          <el-table-column prop="pic" label="图标">
            <img
              :src="stData.row.cover.images[0]"
              width="150"
              height="100"
              alt="头像走丢了~"
              slot-scope="stData"
            />
          </el-table-column>
          <el-table-column prop="title" label="标题" width="300"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-else type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <el-button type="primary" size="mini" @click="$router.push(`/articleedit/${stData.row.id}`)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        class="fenye"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// 引入频道公共组件
import ChannelCom from '@/components/channel.vue'
export default {
  components: {
    // 注册频道独立组件
    ChannelCom
  },
  // 给每一个业务组件都设置name属性值，以便通过devtools调试工具进行准确查找
  name: 'ArticleList',
  data () {
    return {
      // 全部记录条数
      total: 0,
      // 搜索表单数据对象
      searchForm: {
        status: '', // 不传status为全部
        channel_id: '', // 频道
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '',
        // 增加分页相关成员
        page: 1, // 默认获取第一页数据
        per_page: 10 // 每页返回10条记录
      },
      // 临时时间存储
      timetotime: '',
      // 文章列表
      articleList: [],
      // 监听器
      watch: {
        timetotime: function (newv, oldv) {
          if (newv) {
            // 把newv拆开为两份
            this.searchForm.begin_pubdate = newv[0]
            this.searchForm.end_pubdate = newv[1]
          } else {
            // 清除时间信息
            this.searchForm.begin_pubdate = ''
            this.searchForm.end_pubdate = ''
          }
        },
        // 对searchForm的各个成员多深度监听，统一筛选获得文章
        searchForm: {
          handler: function (newv, oldv) {
            this.getArticleList()
          },
          deep: true
        }
      }
    }
  },

  created () {
    this.getArticleList()
  },

  methods: {
    // 获取文章列表信息
    getArticleList () {
      // 把searchForm内部为空的成员都过滤掉
      let searchData = {} // 筛选后的条件数据
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称
        if (this.searchForm[i]) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }

      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把文章赋予articleList成员
            this.articleList = result.data.data.results
            // 将获得好的总记录条数赋予total成员
            this.total = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误' + err)
        })
    },

    // 删除文章
    del (id) {
      this.$confirm('确定要删除么？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let pro = this.$http.delete(`/articles/${id}`)
        pro
          .then(result => {
            this.$message.success('文章删除成功')
            // 更新删除的文章
            this.getArticleList()
          })
          .catch(err => {
            return this.$message.error('删除文章错误' + err)
          })
      }).catch(() => {})
    },

    // 当前页码变化的回调处理事件
    handleCurrentChange (val) {
      // val变化后页码的值
      // 把val赋值给searchForm.page成员
      this.searchForm.page = val
      // 变化后重新获得记录信息
      this.getArticleList()
    },
    // 每页显示条数变化的处理事件
    handleSizeChange (val) {
      // 变化后的页码条数
      this.searchForm.per_page = val
      this.getArticleList()
    },

    // 频道组件方法，获得子组件传递过来的频道id并赋予channel_id成员
    selectHandler (val) {
      this.searchForm.channel_id = val
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
  .fenye {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
