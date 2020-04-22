<template>
  <el-table :data="data.tableData" border style="width: 100%">
    <!--多选框 -->
    <el-table-column type="selection" width="55"></el-table-column>
    <!--文本数据渲染 -->
    <el-table-column
      v-for="item in data.tableConfig.tHead"
      :key="item.field"
      :prop="item.field"
      :label="item.label"
      :width="item.width"
    ></el-table-column>
  </el-table>
</template>
<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  reactive
} from "@vue/composition-api";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    const data = reactive({
      tableConfig: {
        tHead: [],
        pageTurningRecord: false
      },
      tableData: [
        {
          email: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          phone: "1231",
          role: "管理"
        },
        {
          email: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          phone: "1231",
          role: "管理"
        }
      ]
    });
    /**
     * 方法 methods
     */
    const initTableConfig = () => {
      let configData = props.config;
      for (let key in configData) {
        if (data.tableConfig[key]) {
          data.tableConfig[key] = props.config[key];
        }
      }
    };

    onBeforeMount(() => {
      initTableConfig();
    });
    return {
      data
    };
  }
};
</script>
<style lang="sass" scoped>
</style>