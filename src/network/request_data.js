import { request } from "./request";
//获取主页左侧导航栏数据
export function getMenuList() {
  return request({
    url: "/menus",
  });
}

//获取用户管理中的用户列表数据

export function getUserList(userQueryInfo) {
  return request({
    url: "/users",
    params: userQueryInfo,
  });
}

//用户状态修改
export function modifyUserStatus(url) {
  return request({
    method: "put",
    url,
  });
}
//添加用户
export function addUsers(addForm) {
  return request({
    method: "post",
    url: "/users",
    data: addForm,
  });
}
//根据 ID 查询用户信息
export function queryUserById(id) {
  return request({
    url: "/users/" + id,
  });
}
//编辑用户提交

export function editUsers(id, email, mobile) {
  return request({
    method: "put",
    url: "/users/" + id,
    data: {
      email,
      mobile,
    },
  });
}

//删除单个用户
export function deleteUsers(id) {
  return request({
    method: "delete",
    url: "/users/" + id,
  });
}
