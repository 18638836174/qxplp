<template>
  <div class="DiaryDetial">
    <el-page-header @back="goBack" content=""></el-page-header>
    <div class="contentBox">{{content}}</div>
  </div>
</template>

<script>
export default {
  name: "DiaryDetial",
  data() {
    return {
      content: "sadsadasd"
    };
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    }
  }
};
</script>

<style scoped lang='less'>
.DiaryDetial {
  height: 100vh;
}
</style>
