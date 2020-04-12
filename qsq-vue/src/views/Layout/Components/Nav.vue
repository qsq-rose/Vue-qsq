<template >
  <div id="nav_wrap">
    <h1 class="logo">
      <img src="../../../assets/logo.png" alt />
    </h1>

    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item,index) in routers">
        <!-- 一级菜单 -->
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <template slot="title">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <!-- 二级菜单 -->

          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >{{subItem.meta.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import {
  reactive,
  ref,
  onMounted,
  toRefs,
  computed
} from "@vue/composition-api";
export default {
  //name: "navMenu",
  setup(props, { root }) {
    //data数组
    //const isCollapse = ref(false);

    const routers = reactive(root.$router.options.routes);
    //监听
    const isCollapse = computed(() => root.$store.state.app.isCollapse);

    return {
      isCollapse,
      routers
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav_wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #3498db;
  @include webkit(transition, all 0.3s ease 0s);
}
.logo {
  text-align: center;
  img {
    margin: auto;

    width: 80%;
    @include webkit(transition, all 0.3s ease 0s);
  }
}
.open {
  #nav_wrap {
    width: $navMenu;
  }
}
.close {
  #nav_wrap {
    width: 64px;
  }
}
</style>