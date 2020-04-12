<template >
  <div id="main_wrap">
    <div class="main_content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped lang="scss">
@import "../../../styles/config.scss";
#main_wrap {
  height: 100vh;
  //   position: fixed;
  //   top: 75px;
  //   left: $navMenu;
  //   right: 0;
  //   bottom: 0;
  //   border: 30px solid #ecf0f1;
  //   border-bottom: none;
  //   -webkit-box-sizing: border;
}
.main_content {
  width: 100%;
  height: 100%;
  padding-top: 105px;
  padding-left: $navMenu + 30;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 30px;
  @include webkit(transition, all 0.3s ease 0s);
}
.content {
  width: 100%;
  height: 100%;
  padding-top: 30px;
  padding-left: 30px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
}
.open {
  .main_content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main_content {
    padding-left: 64px + 30;
  }
}
</style>