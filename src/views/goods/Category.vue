<template>
  <div class="category">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域---商品列表展示区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格商品分类展示 -->
      <vxe-table
        resizable
        border="full"
        ref="xTree"
        :tree-config="{
          children: 'children',
          iconOpen: 'el-icon-minus',
          iconClose: 'el-icon-plus',
        }"
        :data="categoryArrList"
      >
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column
          field="cat_name"
          title="分类名称"
          tree-node
        ></vxe-table-column>
        <vxe-table-column field="size" title="是否有效">
          <template v-slot="scope">
            <i
              class="el-icon-success vaild"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error invaild" v-else></i>
          </template>
        </vxe-table-column>
        <vxe-table-column field="type" title="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column field="date" title="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="getCateByid(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteCateByid(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </vxe-table-column>
      </vxe-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="50%"
      @close="closeCategoryAddForm"
    >
      <el-form
        :model="categoryForm"
        :rules="categoryRules"
        ref="categoryFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :options="parentCategoryList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCategoryForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商品分类弹出框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCategoryDialogVisible"
      width="50%"
      @close="closeEditCateForm"
    >
      <el-form
        :model="cateInfoId"
        :rules="categoryRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateInfoId.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditCateForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 网络请求相关的函数
import {
  categoryList,
  addCategory,
  queryCategory,
  editCategory,
  deleteCategory,
} from 'network/request_data.js'
export default {
  name: 'category',
  data() {
    return {
      // 请求分类列表数据参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 分类列表数据
      categoryArrList: [],
      // 总的分类条数
      total: 0,
      // 控制添加分类弹出框的显示隐藏
      addCategoryDialogVisible: false,
      // 空值修改分类弹出框的显示隐藏
      editCategoryDialogVisible: false,
      // 添加分类表单数据
      categoryForm: {
        cat_name: '',
        // 分类父 ID
        cat_pid: 0,
        // 分类层级
        cat_level: 0,
      },
      categoryRules: {
        cat_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      // 父级分类列表
      parentCategoryList: [],
      value: [],
      // 级联选择器配置参数
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      // 根据id获取的分类信息
      cateInfoId: {
        id: '',
        cat_name: '',
      },
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 请求分类列表数据
    getCategoryList() {
      categoryList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('分类列表获取失败')
        this.categoryArrList = res.data.result
        this.total = res.data.total
      })
    },
    //每页条数改变时触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCategoryList()
    },
    // 当前页改变时触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCategoryList()
    },
    // 添加分类按钮
    addCategory() {
      // 获取腹肌分类列表数据
      categoryList({ type: 2 }).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取父级列表失败')

        this.parentCategoryList = res.data

        // 打开弹出框
        this.addCategoryDialogVisible = true
      })
    },
    //选择父级分类改变触发事件
    handleChange() {
      let leng = this.value.length
      if (leng > 0) {
        this.categoryForm.cat_pid = this.value[leng - 1]
        this.categoryForm.cat_level = leng
      } else {
        this.categoryForm.cat_pid = 0
        this.categoryForm.cat_level = 0
      }
    },
    //提交添加分类表单
    submitCategoryForm() {
      this.$refs.categoryFormRef.validate((boolean) => {
        if (boolean) {
          addCategory(this.categoryForm).then((res) => {
            if (res.meta.status !== 201)
              return this.$message.error('添加分类失败')
            this.$message.success('添加分类成功')
            this.getCategoryList()
            this.addCategoryDialogVisible = false
          })
        }
      })
    },
    // 关闭添加分类表单清空表单内的值
    closeCategoryAddForm() {
      this.$refs.categoryFormRef.resetFields()
      this.categoryForm.cat_pid = 0
      this.categoryForm.cat_level = 0
      this.value = []
    },
    //根据id获取商品分类
    getCateByid(id) {
      queryCategory(id).then((res) => {
        if (res.meta.status === 200) {
          this.cateInfoId.id = res.data.cat_id
          this.cateInfoId.cat_name = res.data.cat_name
          this.editCategoryDialogVisible = true
        }
      })
    },
    // 关闭修改分类弹出框触发事件
    closeEditCateForm() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 提交修改分类表单
    submitEditCateForm() {
      editCategory(this.cateInfoId.id, this.cateInfoId.cat_name).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('修改商品分类失败')

        this.getCategoryList()
        this.$message.success('修改商品分类成功')
        this.editCategoryDialogVisible = false
      })
    },
    //删除分类操作
    deleteCateByid(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteCategory(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除用户失败')
            this.getCategoryList()
            this.$message.success('删除用户成功')
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
.category {
  padding: 20px;
  .vxe-table {
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
.vaild {
  color: rgb(0, 255, 0);
}
.invaild {
  color: rgb(255, 0, 0);
}
</style>