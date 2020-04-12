<template >
  <div>{{msg}}</div>
</template>
<script>
import { reactive, ref, onMounted, toRefs } from "@vue/composition-api";
export default {
  name: "svgicon",
  setup() {
    const msg = "嘻嘻";
    return {
      msg
    };
  }
};
</script>
<style lang="scss" scoped>
</style>