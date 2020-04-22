<template >
  <div id="category">
    <el-button type="danger" @click="AddFirst()">添加一级分类</el-button>
    <hr style="margin-left: -30px" />
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="categoryall">
          <div class="category" v-for="item in category.item" :key="item.id">
            <h4>
              <i class="el-icon-remove"></i>
              {{item.category_name}}
              <div class="button-group">
                <el-button
                  size="mini"
                  type="danger"
                  round
                  @click="editCategory({categoryName:item.category_name,data:item})"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="success"
                  round
                  @click="addChild({categoryName:item.category_name,data:item})"
                >添加子级</el-button>
                <el-button size="mini" round @click="deleteCategoryConfirm(item.id)">删除</el-button>
              </div>
            </h4>
            <ul v-if="item.children">
              <li v-for="childrenItem in item.children" :key="childrenItem.id">
                {{childrenItem.category_name}}
                <div class="button-group">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <h4 class="menu_item">一级分类编辑</h4>
        <el-form label-width="142px" style="width:410px;padding-top:26px" ref="categoryForm">
          <el-form-item label="一级分类名称：" v-if="category_first">
            <el-input v-model="form.categoryname" :disabled="category_first_disabled"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称：" v-if="category_children">
            <el-input v-model="form.categoryname_child" :disabled="category_children_disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submit"
              :loading="submit_loading"
              :disabled="submit_button_disabled"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  AddFirstCategory,
  GetCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory,
  GetCategoryAll
} from "../../api/new";
import { reactive, ref, onMounted } from "@vue/composition-api";
export default {
  name: "category",
  setup(props, { root, refs }) {
    const form = reactive({
      categoryname: "",
      categoryregion: ""
    });
    const category = reactive({
      item: [],
      current: []
    });
    const submit_button_type = ref("");
    const submit_loading = ref(false);
    const category_first = ref(true);
    const category_children = ref(true);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleted = ref("");
    /**
     * methods
     */
    //添加子级功能
    const addChild = params => {
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      category_children.value = true;
      submit_button_type.value = "category_children_add";
      //console.log(params);
      //存储数据
      category.current = params.data;
      form.categoryname = params.data.category_name;
    };
    //添加子级调用接口
    const addChildCategory = () => {
      if (!form.categoryname_child) {
        root.$message({
          message: "子级分类名称不能为空！",
          type: "error"
        });
        return false;
      }
      let requestData = {
        categoryName: form.categoryname_child,
        parentId: category.current.id
      };
      //console.log(category.current);
      AddChildrenCategory(requestData).then(res => {
        let responseData = res.data.data;
        root.$message({
          message: "添加成功！",
          type: "success"
        });
        form.categoryname_child = "";
        getInfoCategoryAll();
      });
    };
    //删除确认目录
    const deleteCategoryConfirm = categoryID => {
      deleted.value = categoryID;
      root.confirm({
        content: "此操作将永久删除此条信息, 是否继续?",
        fn: deleteCategory,
        catchfn: () => {
          deleted.value = "";
        }
      });
    };
    //调用接口删除目录
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleted.value })
        .then(res => {
          /**
           * es6 findIndex
           */
          let index = category.item.findIndex(item => item.id == deleted.value);
          category.item.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
        });
    };

    //编辑目录
    const editCategory = params => {
      category_children.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      submit_button_type.value = "category_first_edit";
      //一级按钮
      form.categoryname = params.categoryName;
      //保存当前的数据对象
      category.current = params.data;
    };
    //编辑一级目录 调用接口
    const editFirstCategory = () => {
      if (category.current.length == 0) {
        root.$message({
          message: "未选择分类",
          type: "success"
        });
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.categoryname
      };

      EditCategory(requestData)
        .then(res => {
          root.$message({
            message: res.data.message,
            type: "success"
          });

          let data = category.item.filter(
            item => item.id == category.current.id
          );
          category.current.category_name = res.data.data.data.categoryName;
          //console.log(data.item);
          // data[0].category_name = res.data.data.data.categoryName;
          //清空输入框名称
          form.categoryname = "";
          category.current = [];
        })
        .catch(err => {});
    };
    //添加按钮的显示状态
    const AddFirst = params => {
      category_first.value = true;
      category_children.value = false;
      category_first_disabled.value = false;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      submit_button_type.value = "category_first_add";
    };
    //获取目录，在页面加载完成执行
    const getCategory = () => {
      GetCategory({})
        .then(res => {
          let data = res.data.data.data;
          category.item = data;
        })
        .catch(err => {
          console.log(err);
        });
    };
    //获取全部目录，包括自己
    const getInfoCategoryAll = params => {
      GetCategoryAll({}).then(res => {
        category.item = res.data.data;
        //console.log(res);
      });
    };
    //生命周期
    onMounted(() => {
      getInfoCategoryAll();
    });
    const submit = () => {
      if (!form.categoryname) {
        root.$message({
          message: "分类名称不能为空！",
          type: "warning"
        });
        return false;
      }
      if (submit_button_type.value == "category_children_add") {
        addChildCategory();
      }
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
      if (submit_button_type.value == "category_first_add") {
        submit_loading.value = true;
        AddFirstCategory({ categoryName: form.categoryname })
          .then(res => {
            let data = res.data;
            if (data.resCode === 0) {
              root.$message({
                message: data.message,
                type: "success"
              });
              category.item.push(res.data.data);
            }
            submit_loading.value = false;
            refs.categoryForm.resetFields();
            form.categoryname = "";
            form.categoryregion = "";
          })
          .catch(err => {
            submit_loading.value = false;
            refs.categoryForm.resetFields();
            form.categoryname = "";
            form.categoryregion = "";
          });
      }
    };
    return {
      form,
      submit,
      addChild,
      deleted,
      category_first,
      submit_button_type,
      category_children,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      AddFirst,
      category,
      submit_loading,
      deleteCategory,
      deleteCategoryConfirm,
      editCategory,
      editFirstCategory,
      addChildCategory,
      getInfoCategoryAll
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.categoryall {
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: " ";
    position: absolute;
    margin-left: 15px;
    left: 22px;
    top: 0;
    width: 32px;
    bottom: 0;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
    margin-left: 20px;
  }
  .el-icon-remove {
    position: absolute;
    left: 7px;
    top: 0;
    background-color: #fff;
    font-size: 14px;
  }
  li {
    position: relative;
    padding-left: 40px;
    //margin-left: 20px;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      width: 32px;
      border-bottom: 1px dotted #000;
      top: 20px;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 11px;
  top: 1px;
}
.menu_item {
  line-height: 44px;
  background-color: #f3f3f3;
  padding-left: 20px;
}
</style>