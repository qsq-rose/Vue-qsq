<template >
  <div id="login">
    <div class="login_wrap">
      <ul class="menu_tab">
        <li :class="{'current': item.current}" v-for="item in menuTab" :key="item.id" @click="handleMenu(item)">{{item.txt}}</li>
      </ul>
      <!--表单开始-->
                 <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login_form" size="medium">
                <el-form-item  prop="username" class="item_form">
                    <label >邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item  prop="password" class="item_form">
                    <label >密码</label>
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" maxlength="20" minlength="6"></el-input>
                </el-form-item>

                <el-form-item  prop="passwords" class="item_form" v-show="model === 'register'">
                    <label >重复密码</label>
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" maxlength="20" minlength="6"></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="item_form">
                    <label >验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input v-model.number="ruleForm.code" maxlength="6" minlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block">获取验证码</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login_btn block">提交</el-button>
                </el-form-item>
                </el-form>   
    </div>
  </div>
</template>
<script>
import {validateEmail,CheckPassword,validateCode,stripscript} from '@/utils/validate.js'
export default {
  name: "login",
  data() {
      //验证用户名
      var validateUsername = (rule, value, callback) => {
           
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(!validateEmail(value)){
            callback(new Error('用户名格式有误！'))
        }else{
          callback();
        }
      };
      //验证密码
      var validatePassword = (rule, value, callback) => {
        //   this.ruleForm.password = stripscript(value);
        //   value = this.ruleForm.password;
          
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!CheckPassword(value)) {
          callback(new Error('密码至少8个字符，至少1个大写字母，1个小写字母和1个数字'));
        } else {
          callback();
        }
      };
      //验证再次密码
       var validatePasswords = (rule, value, callback) => {
         //  如果模块值为login，直接通过
         if(this.model === 'login'){
            callback();
         }
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.ruleForm.password) {
          callback(new Error('两次密码输入不一致！'));
        } else {
          callback();
        }
      };
      //验证验证码
      var checkCode = (rule, value, callback) => {
           this.ruleForm.code = stripscript(value);
           value = this.ruleForm.code;
          
        if (value === '') {
          return callback(new Error('请输入验证码'));
        }
        else if(!validateCode(value)){
            return callback(new Error('验证码格式有误！'));
        }else{
            callback();
        }
      };
    return {
      menuTab: [{ txt: '登录',current:true,type:"login" }, { txt: '注册',current:false,type:"register" }],
      //注册的值
      model:'login',
      ruleForm: {
          username: '',
          password: '',
          passwords: '',
          code: ''
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords: [
            { validator: validatePasswords, trigger: 'blur' }
          ],
          code: [
            { validator: checkCode, trigger: 'blur' }
          ]
        }
    };
  },
  created() {
      
  },
  mounted() {
      
  },
  methods: {
      handleMenu(data){
          this.menuTab.forEach(element => {
              element.current = false
          });
          data.current = true;
          //修改模型值
          this.model = data.type
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
     

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
.login_form{
    label{
        display: block;
        margin-bottom: 3px;
        font-size: 14px;
        color: #fff;
    }
    .item_form{
        margin-bottom: 13px;
    }
    .block{
        display: block;
        width: 100%;
    }
    .login_btn{
        margin-top: 10px;
    }
}

</style>