<template >
  <!--新增弹窗 -->
  <el-dialog title="修改" :visible.sync="dialogInfo" @close="close" @opened="open">
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
import { AddInfo, GetList, EditInfo } from "@/api/new";
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
    },
    id: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit, root }) {
    const dialogInfo = ref(false);
    const formLabelWidth = ref("70px");
    const form = reactive({
      category: "",
      title: "",
      content: ""
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
        id: props.id,
        categoryId: form.category,
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
      EditInfo(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          submitLoading.value = false;
          /**
           * 两种刷新数据的方式
           * 1.再次请求接口刷新
           * 2.返回列表，手动修改列表数据
           */
          emit("getList");
          dialogInfo.value = false;
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
      console.log(props.id);
      getInfo();
    };
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: props.id
      };
      GetList(requestData).then(res => {
        let requestData = res.data.data.data[0];
        //console.log(requestData);
        form.category = requestData.categoryId;
        form.title = requestData.title;
        form.content = requestData.content;
      });
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
      resetForm,
      getInfo
    };
  }
};
</script>
<style lang="scss" scoped>
</style>