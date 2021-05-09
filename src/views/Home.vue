<template>
  <div id="home">
    <el-button type="info" @click="dropOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    dropOut() {
      window.sessionStorage.clear()
      // window.location.reload();
      this.$router.push('/login')
    },
  },
}
</script>

<style>
</style>