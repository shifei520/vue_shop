<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="userQueryInfo.query"
            clearable
            @clear="clearAll"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表展示表格 -->
      <el-table :data="uesrList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditForm(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="open(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getGrantForm(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userQueryInfo.pagenum"
        :page-sizes="[1, 2, 5, 7]"
        :page-size="userQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeForm"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="closeEditForm"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色弹出框 -->

    <el-dialog
      title="分配用户角色"
      :visible.sync="grantUserDialogVisible"
      width="50%"
      @close="closeUserRoleForm"
    >
      <p class="pMargin">当前的用户：{{ userInfo.username }}</p>
      <p class="pMargin">当前的角色：{{ userInfo.role_name }}</p>
      <p class="pMargin">
        分配新的角色
        <el-select v-model="setRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="grantUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//引入获取用户列表函数/状态请求修改函数
import {
  getUserList,
  modifyUserStatus,
  addUsers,
  queryUserById,
  editUsers,
  deleteUsers,
  getRolesList,
  assignUserRole,
} from 'network/request_data.js'

export default {
  name: 'Users',
  data() {
    // 自定义验证邮箱规则
    let checkEmail = (rule, value, cb) => {
      let reg_1 = /([a-zA-Z0-9_-]+)@([a-zA-Z0-9_-]+)(\.[a-zA-Z0-9_-]+)/
      if (reg_1.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //自定义验证电话号码
    let checkNum = (rule, value, cb) => {
      let reg_2 = /^1[3456789]\d{9}$/
      if (reg_2.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的电话'))
    }
    return {
      // 用户列表请求参数
      userQueryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
      },
      //用户列表数据保存
      uesrList: [],
      total: 0,
      // 添加用户弹出框的显示隐藏
      dialogVisible: false,
      //修改用户弹出框的显示隐藏
      editDialogVisible: false,
      // 分配用户角色弹出框的显示掩藏
      grantUserDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //编辑用户表单数据
      editForm: {},
      //分配用户角色表单数据
      userInfo: {},
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkNum, trigger: 'blur' }],
      },
      // 编辑用户表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' },
        ],
      },
      //所有角色列表
      rolesList: [],
      //要分配的角色id
      setRoleId: null,
    }
  },
  created() {
    this.getUserListData()
  },
  methods: {
    // 用户列表数据请求函数
    getUserListData() {
      getUserList(this.userQueryInfo).then((res) => {
        const { users: data } = res.data
        this.uesrList = data
        this.total = res.data.total
      })
    },
    //每页显示条数
    handleSizeChange(val) {
      this.userQueryInfo.pagesize = val
      this.getUserListData()
    },
    //当前所处页码
    handleCurrentChange(val) {
      this.userQueryInfo.pagenum = val
      this.getUserListData()
    },
    //用户状态改变
    switchChange(val) {
      modifyUserStatus(`users/${val.id}/state/${val.mg_state}`).then((res) => {
        const { status: status } = res.meta
        if (status !== 200) return this.$message.error('修改用户状态失败!')
        this.$message.success('修改用户状态成功!')
      })
    },
    //搜索功能
    search() {
      this.getUserListData()
    },
    //清空搜索框时查询所有数据
    clearAll() {
      this.getUserListData()
    },
    //关闭添加用户对话框触发事件
    closeForm() {
      //重置表单
      this.$refs.addFormRef.resetFields()
    },
    //关闭编辑用户对话框触发事件
    closeEditForm() {
      //重置表单
      this.$refs.editFormRef.resetFields()
    },
    //点击确定提交添加用户表单
    submitForm() {
      this.$refs.addFormRef.validate((boolean) => {
        if (!boolean) return this.$message.error('添加用户失败')
        addUsers(this.addForm).then((res) => {
          if (res.meta.status === 201) {
            //从新请求用户列表从而刷新页面
            this.getUserListData()
            // 关闭对话框
            this.dialogVisible = false
          }
        })
      })
    },
    //点击确定提交编辑用户表单
    submitEditForm() {
      this.$refs.editFormRef.validate((boolean) => {
        if (boolean) {
          editUsers(
            this.editForm.id,
            this.editForm.email,
            this.editForm.mobile
          ).then((res) => {
            if (res.meta.status !== 200) return this.$message.error('更新失败')
            this.getUserListData()
            this.editDialogVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    //点击弹出编辑菜单
    getEditForm(id) {
      queryUserById(id).then((res) => {
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    //删除单个用户消息提示
    open(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUsers(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除用户失败')
            this.getUserListData()
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
    //点击弹出分配用户角色弹出框
    getGrantForm(role) {
      this.userInfo = role
      getRolesList().then((res) => {
        if (res.meta.status === 200) {
          this.rolesList = res.data
        }
      })
      this.grantUserDialogVisible = true
    },
    //提交分配角色请求
    grantUserRole() {
      if (!this.setRoleId) return this.$message.warning('请输入要分配的角色')
      assignUserRole(this.userInfo.id, this.setRoleId).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('分配用户角色失败')
        this.getUserListData()
        this.$message.success('分配用户角色成功')
        this.grantUserDialogVisible = false
      })
    },
    // 关闭用户角色弹出框触发事件
    closeUserRoleForm() {
      this.setRoleId = null
      this.userInfo = {}
    },
  },
}
</script>

<style lang="less" scoped>
.users {
  padding: 20px;
  .pMargin {
    margin-top: 20px;
  }
}
</style>