<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
//所有网络请求相关的函数
import { getRightsList } from 'network/request_data.js'
export default {
  name: 'Rights',
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsListM()
  },
  methods: {
    getRightsListM() {
      getRightsList('/list').then((res) => {
        if (res.meta.status === 200) this.rightsList = res.data
      })
    },
  },
}
</script>

<style lang="less" scoped>
.rights {
  padding: 20px;
}
</style>