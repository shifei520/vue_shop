<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区域 -->
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <!-- 输入框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格列表展示区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>

        <el-table-column prop="create_time" label="下单时间" width="160">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addressFunc"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-setting"
              size="mini"
              @click="logisticsFunc"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改订单状态对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
    >
      <el-form :model="addressForm" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      width="50%"
    >
      <el-timeline reverse="true">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 网络请求相关数据获取
import { orderList, logisticsInfo } from 'network/request_data.js'
import cityData from 'assets/js/citydata.js'
import activities from 'assets/js/logistic.js'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 订单数据列表
      goodsList: [],
      total: 0,
      // 控制修改地址对话框的显示隐藏
      addressDialogVisible: false,
      // 控制物流对话框的显示隐藏
      logisticsDialogVisible: false,
      cityData,
      // 修改地址表单
      addressForm: {
        address1: [],
        address2: '',
      },
      // 物流信息
      activities,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    getOrderList() {
      orderList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('订单数据获取失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    // 一页显示多少条数据
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    // 页码值改变时触发
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getOrderList()
    },
    // 修改订单地址
    addressFunc() {
      this.addressDialogVisible = true
    },
    // 查看物流信息
    logisticsFunc() {
      // return this.$message.error('无法连接数据库')
      // logisticsInfo('1106975712662')
      //   .then((res) => {
      //     if (res.meta.ststus !== 200)
      //       return this.$message.error('获取物流信息失败')
      //     this.activities = res.data
      //     this.logisticsDialogVisible = true
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })

      this.logisticsDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.order {
  padding: 20px;
  .el-table {
    margin-bottom: 20px;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>