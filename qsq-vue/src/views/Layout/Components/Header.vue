<template >
  <div id="header_wrap">
    <div class="header_icon_left" @click="navMenuState">
      <i class="el-icon-s-operation"></i>
    </div>
    <div class="user_info">
      <img class="img" src="../../../icons/pain.jpg" alt />
      <div>{{username}}</div>
    </div>
    <div class="header_icon_right" @click="exit">
      <i class="el-icon-switch-button"></i>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
export default {
  //name: "layoutHeader",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.app.username);
    const navMenuState = () => {
      // root.$store.dispatch("setMenuStatus", { name: "aaaa" });
      root.$store.commit("app/SET_COLLAPSE");
    };
    const exit = () => {
      root.$store.dispatch("app/exit").then(res => {
        root.$router.push({
          name: "login"
        });
      });
    };
    return {
      navMenuState,
      username,
      exit
    };
  }
};
</script>
<style scoped lang="scss">
@import "../../../styles/config.scss";
#header_wrap {
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: 75px;
  background-color: #fff;
  -webkit-box-shadow: 0 3px 16px rgba(0, 0, 0, -1);
  @include webkit(transition, all 0.3s ease 0s);
  line-height: 75px;
}
.header_icon_left {
  float: left;
  padding: 0 32px;
  font-size: 30px;
  margin-bottom: -8px;
  cursor: pointer;
}
.header_icon_right {
  float: right;
  padding: 0 32px;
  font-size: 30px;
  margin-bottom: -8px;
  padding-right: 60px;
  font-size: 25px;
  cursor: pointer;
}
.user_info {
  border-left: 1px solid #dedede;
  height: 100%;
  padding: 0 32px;
  float: left;
  font-size: 18px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .img {
    float: left;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.open {
  #header_wrap {
    left: $navMenu;
  }
}
.close {
  #header_wrap {
    left: 64px;
  }
}
</style>