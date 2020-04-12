<template>
  <div id="login">
    <div class="login_wrap">
      <ul class="menu_tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="handleMenu(item)"
        >{{ item.txt }}</li>
      </ul>
      <!--表单开始-->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login_form"
        size="medium"
      >
        <el-form-item prop="username" class="item_form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item_form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            maxlength="20"
            minlength="6"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item_form" v-show="model === 'register'">
          <label for="passwords">重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            maxlength="20"
            minlength="6"
            id="passwords"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item_form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" maxlength="6" minlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login_btn block"
            :disabled="loginButtonShow"
          >{{model === 'login' ? "登录":"注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive, ref, onMounted, toRefs } from "@vue/composition-api";
import {
  validateEmail,
  CheckPassword,
  validateCode,
  stripscript
} from "@/utils/validate.js";

import axios from "axios";
export default {
  name: "login",
  setup(props, { refs, root }) {
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!validateEmail(value)) {
        callback(new Error("用户名格式有误！"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //   this.ruleForm.password = stripscript(value);
      //   value = this.ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!CheckPassword(value)) {
        callback(
          new Error("密码至少8个字符，至少1个大写字母，1个小写字母和1个数字")
        );
      } else {
        callback();
      }
    };
    //验证再次密码
    let validatePasswords = (rule, value, callback) => {
      //  如果模块值为login，直接通过
      if (model.value === "login") {
        callback();
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("两次密码输入不一致！"));
      } else {
        callback();
      }
    };
    //验证验证码
    let checkCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;

      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (!validateCode(value)) {
        return callback(new Error("验证码格式有误！"));
      } else {
        callback();
      }
    };
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    //模块值
    const model = ref("login");
    //登录按钮的属性
    const loginButtonShow = ref(true);
    //验证码按钮属性
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });

    //倒计时
    const timer = ref(null);
    //表单绑定数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    //表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }]
    });
    /**
     * 声明函数
     */
    const handleMenu = data => {
      menuTab.forEach(element => {
        element.current = false;
      });
      data.current = true;
      //修改模型值
      model.value = data.type;
      resetFormData();
      clearCountDown();
    };
    //重置表单数据
    const resetFormData = () => {
      refs.ruleForm.resetFields();
    };
    //更新按钮状态
    const updateButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };

    //获取验证码
    const getSms = () => {
      //在前端校验用户名是否为空
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！");
        return false;
      }
      if (!validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误！请重新输入");
        return false;
      }

      let requestdata = {
        username: ruleForm.username,
        module: model.value
      };
      updateButtonStatus({
        status: true,
        text: "发送中"
      });

      //在后端验证用户名是否为空
      setTimeout(() => {
        GetSms(requestdata)
          .then(res => {
            let data = res.data;
            root.$message({
              message: data.message,
              type: "success"
            });
            //启用登录按钮
            loginButtonShow.value = false;
            //倒计时
            countDown(60);
          })
          .catch(err => {
            console.log(err);
          });
      }, 3000);
    };
    //提交表单
    const submitForm = formName => {
      //模拟注册成功
      refs[formName].validate(valid => {
        if (valid) {
          if (model.value === "login") {
            login();
          } else {
            regist();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登录
     */
    const login = () => {
      let requestdata = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store.dispatch("app/login", requestdata).then(res => {
        console.log("登录成功！");
        root.$router.push({
          name: "Console"
        });
      });

      // Login(requestdata)
      //   .then(res => {
      //     console.log("登录成功！");
      //     root.$router.push({
      //       name: "Console"
      //     });
      //   })
      //   .catch(err => {});
    };

    /**
     * 注册
     */
    const regist = () => {
      //注册接口
      let requestdata = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        moduleL: "register"
      };
      Register(requestdata)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          handleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch(err => {
          // 失败时候的接口
        });
    };
    //定义验证码倒计时
    const countDown = number => {
      //存在bug，60与0消失
      //判断定时器是否存在，如果存在就清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}`;
        }
      }, 1000);
    };
    //清除倒计时
    const clearCountDown = () => {
      //还原验证码的默认状态
      updateButtonStatus({
        status: false,
        text: "获取验证码"
      });

      clearInterval(timer.value);
    };
    return {
      menuTab,
      model,
      ruleForm,
      rules,
      codeButtonStatus,
      loginButtonShow,
      handleMenu,
      submitForm,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #3498db;
  // background-image: url("../../assets/background.jpeg");
  // background-size: cover;
}
.login_wrap {
  width: 330px;
  margin: auto;
}
.menu_tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 30px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: #27ae60;
  }
}
.login_form {
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item_form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login_btn {
    margin-top: 10px;
  }
}
</style>
