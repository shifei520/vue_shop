import { request } from './request'
//获取主页左侧导航栏数据
export function getMenuList() {
  return request({
    url: '/menus'
  })
}

//获取用户管理中的用户列表数据
export function getUserList(userQueryInfo) {
  return request({
    url: '/users',
    params: userQueryInfo
  })
}

//用户状态修改
export function modifyUserStatus(url) {
  return request({
    method: 'put',
    url
  })
}
//添加用户
export function addUsers(addForm) {
  return request({
    method: 'post',
    url: '/users',
    data: addForm
  })
}
//根据 ID 查询用户信息
export function queryUserById(id) {
  return request({
    url: '/users/' + id
  })
}
//编辑用户提交
export function editUsers(id, email, mobile) {
  return request({
    method: 'put',
    url: '/users/' + id,
    data: {
      email,
      mobile
    }
  })
}

//删除单个用户
export function deleteUsers(id) {
  return request({
    method: 'delete',
    url: '/users/' + id
  })
}

//获取权限列表
export function getRightsList(type) {
  return request({
    url: '/rights' + type
  })
}

//获取角色列表
export function getRolesList() {
  return request({
    url: '/roles'
  })
}

//添加角色
export function addRoles(addForm) {
  return request({
    method: 'post',
    url: '/roles',
    data: addForm
  })
}
//根据 ID 查询角色信息
export function queryRoleById(id) {
  return request({
    url: '/roles/' + id
  })
}

//编辑角色表单提交
export function editRole(id, name, desc) {
  return request({
    method: 'put',
    url: '/roles/' + id,
    data: {
      roleName: name,
      roleDesc: desc
    }
  })
}
//根据id删除单个角色
export function deleteOneRole(id) {
  return request({
    method: 'delete',
    url: '/roles/' + id
  })
}

//删除角色指定权限
export function deleteOneRight(roleId, rightId) {
  return request({
    method: 'delete',
    url: '/roles/' + roleId + '/rights/' + rightId
  })
}

//角色授权
export function grantRights(roleId, arr) {
  return request({
    method: 'post',
    url: '/roles/' + roleId + '/rights',
    data: {
      rids: arr
    }
  })
}
//分配用户角色
export function assignUserRole(id, rid) {
  return request({
    method: 'put',
    url: '/users/' + id + '/role',
    data: {
      rid
    }
  })
}
