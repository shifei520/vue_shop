<template>
  <el-container id="home">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="dropOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="asideWidth" ref="elAsideHome">
        <!-- 收缩伸展按钮 -->
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏导航 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isToggle"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 循环遍历一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in MenuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 循环遍历二级菜单 -->
            <el-menu-item
              :index="'/' + itemChild.path"
              v-for="itemChild in item.children"
              :key="itemChild.id"
              @click="saveActivePath('/' + itemChild.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ itemChild.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//导入侧边栏列表数据
import { getMenuList } from "network/request_data.js";

export default {
  name: "Home",
  data() {
    return {
      //侧边栏列表
      MenuList: [],
      //列表图标
      menuIcon: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      //侧边栏伸展收缩变量
      isToggle: false,
      activePath: "",
    };
  },
  created() {
    //组建刚创建就获取列表数据
    this.getMenuListData();
    //创建时就获取路径使左侧导航栏高亮
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  computed: {
    asideWidth() {
      return this.isToggle ? "64px" : "200px";
    },
  },
  methods: {
    //退出登录按钮功能
    dropOut() {
      window.sessionStorage.clear();
      // window.location.reload();
      this.$router.push("/login");
    },
    //获取左侧列表数据
    getMenuListData() {
      getMenuList().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取列表数据失败!");
        // console.log(res)
        this.MenuList = res.data;
      });
    },
    //侧边栏伸展收缩
    toggle() {
      this.isToggle = !this.isToggle;
    },
    //保存当前登录路径
    saveActivePath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  color: #fff;
}
.el-header {
  display: flex;
  font-size: 20px;

  background-color: #373d41;
  justify-content: space-between;
  align-items: center;
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
  transition: width 0.5s;
  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    letter-spacing: 3px;
    cursor: pointer;
    user-select: none;
  }
}
.el-menu {
  border-right: 0;
}
.el-main {
  background-color: #eaedf1;
  padding: 0;
  color: #000;
}
.iconfont {
  margin-right: 10px;
}
</style>