<template>
  <el-select v-model="chid" clearable placeholder="请选择">
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelCom',
  // 接受父组件传递过来的频道信息
  props: {
    cid: {
      default: 0 // 设置默认值
    }
  },
  created () {
    // 获得频道列表
    this.getChannelList()
  },
  watch: {
    // 对cid做监听，使得cid的信息被赋予给chid使用
    cid: function (newv, oldv) {
      this.chid = newv
    },
    // 对chid做监听
    chid: function (newv, oldv) {
      // 调用自己的slt方法
      this.$emit('slt', this.chid)
    }
  },
  data () {
    return {
      chid: '', // 记录当前选中的频道信息
      channelList: [] // 频道列表
    }
  },
  methods: {
    // 获取频道数据方法
    getChannelList () {
      var pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得文章频道错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
