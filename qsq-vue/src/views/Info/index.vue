<template >
  <div>
    <!--导航栏开始 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="14">
        <!-- <el-col :span="6"> -->
        <el-form-item label="类型:">
          <el-select v-model="categoryValue" placeholder="请选择">
            <el-option
              v-for="item in options.category"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="2"> -->
        <el-form-item label="日期:">
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
          ></el-date-picker>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="8"> -->
        <el-form-item label="关键字:">
          <el-select v-model="searchKey" placeholder="请选择" style="width:80px">
            <el-option
              v-for="item in optionKey"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="3"> -->
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width:120px"></el-input>

        <el-button type="danger" style="margin-left:10px" @click="search">搜索</el-button>
        <el-button type="danger" class="addButton" @click="dialog_data = true">新增</el-button>
        <!-- </el-col> -->
      </el-row>
    </el-form>
    <div class="black-space-30"></div>

    <!--表格开始 -->
    <el-table :data="tableData.item" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="标题" width="730"></el-table-column>
      <!--:formatter="toCategory" -->
      <el-table-column prop="categoryId" label="类型" width="80"></el-table-column>
      <el-table-column prop="createDate" label="日期" :formatter="toDate"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <div class="editButton">
            <el-button type="danger" size="mini" width="100" @click="deleteItem(scope.row.id)">删除</el-button>
            <el-button type="success" size="mini" width="100" @click="editInfo(scope.row.id)">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部分页-->
    <el-row>
      <el-col :span="11">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="13">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="float:right"
        ></el-pagination>
      </el-col>
    </el-row>
    <!--新增弹窗 -->
    <DialogInfo :flag.sync="dialog_data" :category="options.category" @close="closeDialog"></DialogInfo>
    <!--修改弹窗 -->
    <DialogEditInfo
      :flag.sync="dialog_data_edit"
      :id="infoId"
      :category="options.category"
      @close="closeDialog"
      @getList="getList"
    ></DialogEditInfo>
  </div>
</template>
<script>
import { GetList, DeleteInfo } from "@/api/new";
import DialogInfo from "./diaLog/info";
import DialogEditInfo from "./diaLog/edit";
import { common } from "@/api/common";
import { timestampToTime } from "@/utils/time";
import {
  reactive,
  ref,
  onMounted,
  toRefs,
  computed,
  watch
} from "@vue/composition-api";
export default {
  name: "infoIndex",
  //弹窗数据
  components: { DialogInfo, DialogEditInfo },
  setup(props, { root }) {
    const { getInfoCategory, category } = common();

    const options = reactive({
      category: []
    });
    //搜索关键字
    const optionKey = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    const closeDialog = () => {
      dialog_data.value = false;
    };
    const dialog_data = ref(false);
    const dialog_data_edit = ref(false);
    const searchKey = ref("id");
    const categoryValue = ref("");
    const dateValue = ref("");
    const search_keyWork = ref("");
    const deleteInfoId = ref("");
    const infoId = ref("");

    //总页数
    const total = ref(0);
    //页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    //表格数据
    const tableData = reactive({
      item: []
    });
    //methods
    const editInfo = id => {
      infoId.value = id;

      dialog_data_edit.value = true;
    };
    const handleSelectionChange = val => {
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
      // console.log(val);
    };
    const handleSizeChange = val => {
      //console.log(val);
      page.pageSize = val;
      getList();
    };
    const handleCurrentChange = val => {
      page.pageNumber = val;
      getList();
    };

    //methods
    const toDate = row => {
      return timestampToTime(row.createDate);
    };
    const toCategory = row => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(
        item => item.id == row.categoryId
      )[0];
      return categoryData.category_name;
    };
    const search = () => {
      let requestData = formatData();
      //console.log(requestData);
      getList();
    };
    //搜索条件处理
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      if (categoryValue.value) {
        requestData.categoryId = categoryValue.value;
      }
      if (dateValue.value.length > 0) {
        requestData.startTiem = dateValue.value[0];
        requestData.endTime = dateValue.value[1];
      }
      if (search_keyWork.value) {
        requestData[searchKey.value] = search_keyWork.value;
      }
      return requestData;
    };
    const getList = () => {
      let requestData = formatData();
      GetList(requestData).then(res => {
        let data = res.data.data;
        tableData.item = data.data;
        total.value = data.total;
        //console.log(total.value);
      });
    };
    watch(
      () => category.item,
      value => {
        options.category = value;
      }
    );
    //生命周期
    onMounted(() => {
      getInfoCategory();
      getList();
    });
    const deleteItem = value => {
      deleteInfoId.value = [value];
      root.confirm({
        content: "此操作将永久删除此条信息, 是否继续?",
        fn: confirmDelete
      });
    };
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        root.$message({
          message: "请选择要删除的数据",
          type: "error"
        });
        return false;
      }
      root.confirm({
        content: "此操作将永久批量删除信息, 是否继续?",
        fn: confirmDelete
      });
    };
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value }).then(res => {
        //console.log(res);
        deleteInfoId.value = "";
        getList();
      });
    };
    return {
      infoId,
      dialog_data,
      handleSizeChange,
      handleCurrentChange,
      dialog_data_edit,
      deleteInfoId,
      deleteItem,
      deleteAll,
      confirmDelete,
      options,
      categoryValue,
      formatData,
      dateValue,
      optionKey,
      searchKey,
      search_keyWork,
      closeDialog,
      getList,
      tableData,
      total,
      page,
      toDate,
      toCategory,
      handleSelectionChange,
      editInfo,
      search
    };
  }
};
</script>
<style lang="scss" scoped>
.close {
  .addButton {
    margin-left: 180px;
    width: 120px;
  }
}
.open {
  .addButton {
    margin-left: 60px;
  }
}
.editButton {
  float: right;
}
</style>