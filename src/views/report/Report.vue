<template>
  <div class="report">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <div id="main" style="width: 1000px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts图表视图
import * as echarts from 'echarts'
// 引入网络请求相关函数
import { chartData } from 'network/request_data.js'
export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  mounted() {
    this.showEcharts()
  },
  methods: {
    showEcharts() {
      var myChart = echarts.init(document.getElementById('main'))

      chartData().then((res) => {
        const newObj = Object.assign(this.options, res.data)
        myChart.setOption(newObj)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.report {
  padding: 20px;
}
</style>