<template>
  <div class="goods-list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsFunc">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表表格数据展示 -->
      <el-table :data="goodsListArr" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="90px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="130px">
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// 网络请求相关函数
import { goodsList, deleteGoods } from 'network/request_data.js'
export default {
  name: 'GoodsList',
  data() {
    return {
      // 请求商品列表相关参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      goodsListArr: [],
      // 总商品数量
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    getGoodsList() {
      goodsList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取商品列表失败')

        this.$message.success('获取商品列表成功')
        this.goodsListArr = res.data.goods
        this.total = res.data.total
      })
    },
    // 一页显示多少条数据
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    // 当前的页码
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getGoodsList()
    },
    // 路由跳转到添加商品页面
    addGoodsFunc() {
      this.$router.push('goods/add')
    },
    // 删除商品
    deleteGoods(row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteGoods(row.goods_id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除商品失败')
            this.getGoodsList()
            this.$message.success('删除商品成功')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.goods-list {
  padding: 20px;
  .el-table {
    margin-bottom: 15px;
  }
}
</style>