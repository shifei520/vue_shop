<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表展示 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="[
                'bottom-line',
                index1 === 0 ? 'top-line' : '',
                'vertical-center',
              ]"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRights(scope, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级与三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'top-line', 'vertical-center']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="deleteRights(scope, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      @close="deleteRights(scope, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditForm(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="roleRightList(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="rolesDialogVisible"
      width="30%"
      @close="closeAddRoleForm"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRoleReq">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="closeEditRoleForm"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色ID">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoleForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleRightsDialogVisible"
      width="50%"
      @close="closeRightTree"
    >
      <el-tree
        :data="treeRightList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultChecked"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRloeRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//网络请求函数
import {
  getRolesList,
  addRoles,
  queryRoleById,
  editRole,
  deleteOneRole,
  deleteOneRight,
  getRightsList,
  grantRights,
} from 'network/request_data.js'
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 添加用户弹出框显示隐藏
      rolesDialogVisible: false,
      // 修改用户弹出框显示隐藏
      editDialogVisible: false,
      // 分配角色权限弹出框显示隐藏
      roleRightsDialogVisible: false,
      // 添加用户表单信息
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 修改用户表单信息
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      // 添加用户表单验证规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
      },
      //修改用户表单验证规则
      editFormRules: {
        roleId: [
          { required: true, message: '用户ID不能为空', trigger: 'blur' },
        ],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
      },
      //权限用户列表
      treeRightList: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      //默认选中的选项
      defaultChecked: [],
      //当前授权角色的Id
      roleId: '',
    }
  },
  created() {
    this.getRolesListM()
  },
  methods: {
    getRolesListM() {
      getRolesList().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('角色列表请求错误')
        this.rolesList = res.data
      })
    },
    // 提交添加角色请求
    submitAddRoleReq() {
      this.$refs.addRoleFormRef.validate((boolean) => {
        if (!boolean) return this.$message.error('添加角色失败')
        addRoles(this.addRoleForm).then((res) => {
          if (res.meta.status === 201) {
            this.getRolesListM()
            this.rolesDialogVisible = false
          }
        })
      })
    },
    //根据当前角色id获取相应数据
    getEditForm(id) {
      queryRoleById(id).then((res) => {
        if (res.meta.status === 200) {
          this.editForm.roleId = res.data.roleId
          this.editForm.roleName = res.data.roleName
          this.editForm.roleDesc = res.data.roleDesc
          this.editDialogVisible = true
        }
      })
    },
    //关闭添加角色对话框触发的事件
    closeAddRoleForm() {
      this.$refs.addRoleFormRef.resetFields()
    },
    //关闭修改角色对话框触发的事件
    closeEditRoleForm() {
      this.$refs.editRoleFormRef.resetFields()
    },
    //提交修改表单
    submitEditRoleForm() {
      this.$refs.editRoleFormRef.validate((boolean) => {
        if (!boolean) return this.$message.error('添加角色失败')
        editRole(
          this.editForm.roleId,
          this.editForm.roleName,
          this.editForm.roleDesc
        ).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error('角色信息修改错误')
          this.getRolesListM()
          this.editDialogVisible = false
        })
      })
    },
    //删除单个用户消息提示
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOneRole(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除用户失败')
            this.getRolesListM()
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
    //删除角色指定权限
    deleteRights(scope, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOneRight(scope.row.id, rightId).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error('删除权限失败')
            scope.row.children = res.data
            this.$message.success('删除权限成功')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //分配权限对话框
    roleRightList(role) {
      getRightsList('/tree').then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('请求权限列表错误')
        }
        this.treeRightList = res.data
      })
      // 给默认选中数组添加默认数据
      this.getRights(role, this.defaultChecked)
      // 获取角色id，为后续授权做准备
      this.roleId = role.id
      this.roleRightsDialogVisible = true
    },
    // 递归函数获取三级权限
    getRights(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getRights(item, arr)
      })
    },
    //关闭权限分配对话框
    closeRightTree() {
      this.defaultChecked = []
      this.treeRightList = []
    },
    //给角色授权
    grantRloeRights() {
      const keyArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const str = keyArr.join(',')

      grantRights(this.roleId, str).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('角色权限分配失败')

        this.roleRightsDialogVisible = false
        this.$message.success('角色权限分配成功')
        this.getRolesListM()
      })
    },
  },
}
</script>

<style lang="less" scoped>
.roles {
  padding: 20px;
}
.el-tag {
  margin: 7px;
}
.bottom-line {
  border-bottom: 1px solid #eee;
}
.top-line {
  border-top: 1px solid #eee;
}
.vertical-center {
  display: flex;
  align-items: center;
}
</style>