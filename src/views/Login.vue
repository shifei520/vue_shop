<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/avatar.jpg" alt="" />
      </div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="formLogin"
        :rules="formLoginRules"
        ref="formLoginRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-supplier-features-fill"
            placeholder="请输入用户名"
            v-model="formLogin.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            show-password
            prefix-icon="iconfont icon-unlock-fill"
            v-model="formLogin.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formLogin: {
        username: 'admin',
        password: '123456',
      },
      formLoginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    //重置表单
    resetForm() {
      this.$refs.formLoginRef.resetFields()
    },
    //登陆操作
    login() {
      this.$refs.formLoginRef.validate((valid) => {
        if (!valid) return
        this.$http.post('login', this.formLogin).then((res) => {
          // console.log(res)
          if (res.data.meta.status !== 200)
            return this.$message.error('登陆失败!')
          this.$message.success('登陆成功!')
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);
    .avatar_box {
      position: absolute;
      left: 50%;
      width: 130px;
      height: 130px;
      border: 1px solid rgb(173, 172, 172);
      overflow: hidden;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>