<template >
  <!--新增弹窗 -->
  <el-dialog title="新增" :visible.sync="dialogInfo" @close="close" @opened="open">
    <el-form :model="form" ref="addInfoForm">
      <el-form-item label="类型：" :label-width="formLabelWidth">
        <el-select v-model="form.category" placeholder="请选择类型">
          <el-option
            v-for="item in openOption.item"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth">
        <el-input v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="概况：" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AddInfo } from "@/api/new";
import { reactive, ref, watchEffect } from "@vue/composition-api";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, root }) {
    const dialogInfo = ref(false);
    const formLabelWidth = ref("70px");
    const form = reactive({
      title: "",
      content: "",
      category: ""
    });
    const openOption = reactive({
      item: []
    });
    const submitLoading = ref(false);
    const resetForm = () => {
      (form.category = ""), (form.title = ""), (form.content = "");
    };
    const submit = () => {
      let requestData = {
        category: form.category,
        title: form.title,
        content: form.content
      };
      if (!form.category) {
        root.$message({
          message: "分类不能为空",
          type: "error"
        });
        return false;
      }
      submitLoading.value = true;
      AddInfo(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          submitLoading.value = false;
        })
        .then(err => {
          submitLoading.value = false;
        });
      resetForm();
    };
    watchEffect(() => (dialogInfo.value = props.flag));
    const close = () => {
      dialogInfo.value = false;
      emit("update:flag", false);
      resetForm();
    };

    const open = () => {
      openOption.item = props.category;
    };
    return {
      dialogInfo,
      formLabelWidth,
      submitLoading,
      form,
      close,
      open,
      watchEffect,
      openOption,
      submit,
      resetForm
    };
  }
};
</script>
<style lang="scss" scoped>
</style>