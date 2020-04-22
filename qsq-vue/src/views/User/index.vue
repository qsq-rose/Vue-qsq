<template >
  <div>
    <el-row :gutter="16">
      <el-col :span="20">
        <div class="label-wrap">关键字：</div>
        <div class="wrap-content">
          <el-row :gutter="16">
            <el-col :span="3">
              <el-select size="small" v-model="data.selectValue" placeholder="请选择">
                <el-option
                  v-for="item in data.options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input size="small"></el-input>
            </el-col>
            <el-col :span="16">
              <el-button size="small" type="danger">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-col :span="4">
        <el-button type="danger" style="float:right； margin-left: 40px;">新增用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <TableVue :config="data.configTable" />
  </div>
</template>
<script>
import {
  reactive,
  ref,
  onMounted,
  toRefs,
  computed,
  watch
} from "@vue/composition-api";
import TableVue from "../../components/Table";
export default {
  name: "userIndex",
  components: {
    TableVue
  },
  setup(props) {
    const data = reactive({
      selectValue: "",
      //翻页记录
      pageTurningRecord: true,
      options: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" }
      ],
      configTable: {
        tHead: [
          { label: "邮箱/用户名", field: "email", width: 200 },
          { label: "真实姓名", field: "name", width: 120 },
          { label: "手机号", field: "address" },
          { label: "地区", field: "phone" },
          { label: "角色", field: "role" }
        ]
      }
    });
    return { data };
  }
};
</script>
<style lang="scss" scoped>
.label-wrap {
  float: left;
  width: 60px;
  text-align: center;
  font-size: 14px;
  line-height: 40px;
}
.wrap-content {
  margin-left: 40px;
}
</style>