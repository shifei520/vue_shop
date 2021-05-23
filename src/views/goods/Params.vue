<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="注意： 只允许为第三级分类设置相关参数"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
      <el-row class=".elrow2">
        <!-- 选择商品分类 -->
        <el-col
          >选择商品分类：
          <el-cascader
            v-model="value"
            :options="childCategoryList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 动态参数和静态参数tab栏切换区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isActive"
            type="primary"
            size="mini"
            @click="paramsDialogVisible = true"
          >
            添加参数</el-button
          >
          <el-table :data="manyTableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="deleteVals(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入框与标签的切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsFunc(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsFunc(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isActive"
            type="primary"
            size="mini"
            @click="paramsDialogVisible = true"
          >
            添加参数</el-button
          >
          <el-table :data="onlyTableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="deleteVals(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入框与标签的切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsFunc(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsFunc(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog
        :title="'添加' + paramsText"
        :visible.sync="paramsDialogVisible"
        width="50%"
        @close="closeParamsForm"
      >
        <el-form
          :model="paramsForm"
          :rules="paramsFormRule"
          ref="paramsFormRef"
          label-width="100px"
        >
          <el-form-item :label="paramsText" prop="attr_name">
            <el-input v-model="paramsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="paramsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsFunc">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog
        :title="'修改' + paramsText"
        :visible.sync="editParamsDialogVisible"
        width="50%"
        @close="closeEditParamsForm"
      >
        <el-form
          :model="editParamsForm"
          :rules="editParamsFormRule"
          ref="editParamsFormRef"
          label-width="100px"
        >
          <el-form-item :label="paramsText" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditParamsFunc"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 网络请求相关函数
import {
  categoryList,
  paramsList,
  addParams,
  modifyParams,
  queryParamsById,
  deleteParams,
} from 'network/request_data.js'

export default {
  name: 'Params',
  data() {
    return {
      // 选择商品参数
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选择商品绑定的数据源
      childCategoryList: [],
      // 通过级联选择器选择的商品id
      value: [],
      // 当前显示tab栏的name属性
      activeName: 'many',
      // 动态参数表格数据
      manyTableData: [],
      // 静态参数表格数据
      onlyTableData: [],
      // 添加参数对话框的显示隐藏
      paramsDialogVisible: false,
      // 修改参数对话框的显示隐藏
      editParamsDialogVisible: false,
      // 添加参数表单数据
      paramsForm: {
        attr_name: '',
      },
      // 修改参数表单数据,
      editParamsForm: {},
      // 添加参数验证规则
      paramsFormRule: {
        attr_name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' },
        ],
      },
      // 修改参数验证规则
      editParamsFormRule: {
        attr_name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCategoryList()
  },
  computed: {
    // 判断添加参数按钮是否能够被点击
    isActive() {
      if (this.value.length !== 3) {
        return true
      } else {
        return false
      }
    },
    paramsText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    },
  },
  methods: {
    //选择商品分类触发事件
    handleChange() {
      this.getParamsList()
    },
    // 请求分类列表数据
    getCategoryList() {
      categoryList({ type: 3 }).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('分类列表获取失败')
        this.childCategoryList = res.data
      })
    },
    // tab栏点击切换触发函数
    handleTabClick() {
      this.getParamsList()
    },
    // 获取商品参数数据
    getParamsList() {
      if (this.value.length !== 3) {
        this.value = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 获取商品参数
      paramsList(this.value[2], this.activeName).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取参数列表失败')
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 将inputVisible和inputValue绑定在单个item项中
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    // 关闭添加参数对话框触发事件
    closeParamsForm() {
      this.$refs.paramsFormRef.resetFields()
    },
    // 关闭修改参数对话框触发事件
    closeEditParamsForm() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 发起添加参数请求
    addParamsFunc() {
      this.$refs.paramsFormRef.validate((boolean) => {
        if (boolean) {
          addParams(this.value[2], {
            attr_name: this.paramsForm.attr_name,
            attr_sel: this.activeName,
          }).then((res) => {
            if (res.meta.status !== 201)
              return this.$message.error('添加参数失败')
            this.$message.success('添加参数成功')
            this.getParamsList()
            this.paramsDialogVisible = false
          })
        }
      })
    },
    // 发起修改参数请求
    submitEditParamsFunc() {
      this.$refs.editParamsFormRef.validate((boolean) => {
        if (boolean) {
          modifyParams(
            this.value[2],
            this.editParamsForm.attr_id,
            this.activeName,
            this.editParamsForm.attr_name
          ).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('修改参数失败')

            this.$message.success('修改参数成功')
            this.editParamsDialogVisible = false
            this.getParamsList()
          })
        }
      })
    },
    //点击修改按钮
    editParamsFunc(id) {
      queryParamsById(this.value[2], id, this.activeName).then((res) => {
        if (res.meta.status === 200) {
          this.editParamsForm = res.data
          this.editParamsDialogVisible = true
        }
      })
    },
    // 点击删除按钮
    deleteParamsFunc(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteParams(this.value[2], id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除参数失败')
            this.getParamsList()
            this.$message.success('删除参数成功')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 失去焦点或按enter触发事件
    handleInputConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputValue = ''
        row.inputVisible = false
        return
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
      }
      // 动态参数值添加
      this.addDeleteVals(row)
    },
    // 点击New tag触发事件
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签属性值
    deleteVals(i, row) {
      row.attr_vals.splice(i, 1)
      this.addDeleteVals(row)
    },
    // 添加删除参数值函数
    addDeleteVals(row) {
      modifyParams(
        this.value[2],
        row.attr_id,
        this.activeName,
        row.attr_name,
        row.attr_vals.join(' ')
      ).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('修改参数可选值失败')
        this.$message.success('修改参数可选值成功')
        row.inputVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.params {
  padding: 20px;
  .el-tabs {
    .el-tag {
      margin: 15px;
    }
  }
  .el-card {
    .el-row:nth-child(2) {
      margin-top: 20px;
    }
  }
}
.input-new-tag {
  width: 180px;
}
</style>